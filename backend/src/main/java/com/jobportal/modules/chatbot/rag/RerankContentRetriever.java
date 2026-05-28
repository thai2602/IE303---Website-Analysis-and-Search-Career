package com.jobportal.modules.chatbot.rag;

import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Query;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Two-Stage Retrieval ContentRetriever Wrapper.
 *
 * <pre>
 *   Stage 1: Vector DB retrieves Top-K raw results (e.g. K = 15)
 *   Stage 2: Local BAAI/bge-reranker API re-scores and filters down to Top-N (e.g. N = 3)
 * </pre>
 *
 * Gracefully falls back to raw Vector DB top results if Reranker API is offline.
 */
@Slf4j
public class RerankContentRetriever implements ContentRetriever {

    private final ContentRetriever delegate;
    private final RestTemplate restTemplate;
    private final String rerankerUrl;
    private final int topN;

    public RerankContentRetriever(ContentRetriever delegate, int topN) {
        this.delegate = delegate;
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(1500); // 1.5s connect timeout
        requestFactory.setReadTimeout(2500);    // 2.5s read timeout
        this.restTemplate = new RestTemplate(requestFactory);
        this.rerankerUrl = "http://localhost:8000/rerank";
        this.topN = topN;
    }

    @Override
    public List<Content> retrieve(Query query) {
        // Step 1: Retrieve K raw results from Vector DB delegate
        List<Content> rawContents = delegate.retrieve(query);
        if (rawContents == null || rawContents.isEmpty()) {
            return new ArrayList<>();
        }

        // Step 2: Attempt local BAAI Reranking
        try {
            List<String> documents = rawContents.stream()
                    .map(c -> c.textSegment() != null ? c.textSegment().text() : "")
                    .collect(Collectors.toList());

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("query", query.text());
            requestBody.put("documents", documents);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<RerankResponse> responseEntity = restTemplate.postForEntity(
                    rerankerUrl, entity, RerankResponse.class);

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                RerankResponse responseBody = responseEntity.getBody();
                List<RerankResult> results = responseBody.getResults();

                List<Content> rerankedContents = new ArrayList<>();
                // Reconstruct Content list ordered by Reranker scores
                for (int i = 0; i < Math.min(topN, results.size()); i++) {
                    RerankResult res = results.get(i);
                    Content matched = findMatchedContent(res.getDocument(), rawContents);
                    if (matched != null) {
                        rerankedContents.add(matched);
                    } else {
                        rerankedContents.add(Content.from(res.getDocument()));
                    }
                }
                log.info("[Reranker] Successfully reranked {} docs down to Top {} using BAAI/bge-reranker.",
                        rawContents.size(), rerankedContents.size());
                return rerankedContents;
            }
        } catch (Exception e) {
            // Graceful fallback to first N raw results if Reranker API is offline/errors
            log.warn("[Reranker] Offline or failed ({}). Gracefully falling back to Top {} raw vector results.",
                    e.getMessage(), Math.min(topN, rawContents.size()));
        }

        // Fallback: return the first topN raw results from Vector DB
        return rawContents.stream()
                .limit(topN)
                .collect(Collectors.toList());
    }

    private Content findMatchedContent(String text, List<Content> rawContents) {
        for (Content c : rawContents) {
            if (c.textSegment() != null && c.textSegment().text().equals(text)) {
                return c;
            }
        }
        return null;
    }

    // JSON mapping helper classes
    public static class RerankResponse {
        private List<RerankResult> results;
        public List<RerankResult> getResults() { return results; }
        public void setResults(List<RerankResult> results) { this.results = results; }
    }

    public static class RerankResult {
        private String document;
        private double score;
        public String getDocument() { return document; }
        public void setDocument(String document) { this.document = document; }
        public double getScore() { return score; }
        public void setScore(double score) { this.score = score; }
    }
}
