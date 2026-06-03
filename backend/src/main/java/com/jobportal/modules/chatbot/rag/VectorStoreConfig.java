package com.jobportal.modules.chatbot.rag;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import lombok.extern.slf4j.Slf4j;

/**
 * Dual Vector Store Configuration.
 *
 *  hrKnowledgeStore  → raw/hr_rules + raw/ats_guides (tiêu chí chấm CV, ATS rules)
 *  jobMarketStore    → processed/jobs CSV (dữ liệu thị trường việc làm)
 *
 * Mỗi store được persist sang file JSON riêng để tránh re-embed khi restart.
 * Để force re-index: xóa file tương ứng trong rag-data/embeddings/ rồi restart.
 */
@Slf4j
@Configuration
public class VectorStoreConfig {

    @Value("${rag.data.path:src/main/resources/rag-data}")
    private String ragDataPath;

    @Value("${rag.load-job-store:true}")
    private boolean loadJobStore;


    /** HR Knowledge Store: tiêu chí HR, ATS guides, red-flags → persist vào hr_store.json */
    @Bean("hrKnowledgeStore")
    public EmbeddingStore<TextSegment> hrKnowledgeStore() {
        Path storePath = Paths.get(ragDataPath, "embeddings", "hr_store.json");
        if (Files.exists(storePath)) {
            log.info("[HR Store] Loading from {}", storePath.toAbsolutePath());
            return InMemoryEmbeddingStore.fromFile(storePath);
        }
        log.info("[HR Store] No existing store found — will be populated on startup.");
        return new InMemoryEmbeddingStore<>();
    }

    /** Job Market Store: CSV job descriptions → persist vào job_store.json */
    @Bean("jobMarketStore")
    public EmbeddingStore<TextSegment> jobMarketStore() {
        if (!loadJobStore) {
            log.info("[Job Store] Disabled by configuration (rag.load-job-store = false). Returning empty store.");
            return new InMemoryEmbeddingStore<>();
        }
        Path storePath = Paths.get(ragDataPath, "embeddings", "job_store.json");
        if (Files.exists(storePath)) {
            log.info("[Job Store] Loading from {}", storePath.toAbsolutePath());
            return InMemoryEmbeddingStore.fromFile(storePath);
        }
        log.info("[Job Store] No existing store found — will be populated on startup.");
        return new InMemoryEmbeddingStore<>();
    }
}
