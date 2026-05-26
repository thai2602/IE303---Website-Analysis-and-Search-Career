package com.jobportal.modules.chatbot.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.jobportal.modules.chatbot.rag.Chunkers;
import com.jobportal.modules.chatbot.rag.Loaders;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * Dual RAG Pipeline Service.
 *
 * <pre>
 *   hrKnowledgeStore  ← raw/ (hr_rules, ats_guides)      → hr_store.json
 *   jobMarketStore    ← processed/jobs/ (CSV)             → job_store.json
 * </pre>
 *
 * Khi restart, nếu file JSON đã tồn tại thì skip ingestion.
 * Để force re-index: xóa file tương ứng trong rag-data/embeddings/ rồi restart.
 */
@Slf4j
@Service
public class RagService {

    @Getter
    private final EmbeddingStore<TextSegment> hrKnowledgeStore;
    @Getter
    private final EmbeddingStore<TextSegment> jobMarketStore;
    @Getter
    private final EmbeddingModel embeddingModel;

    private final Loaders loaders;
    private final Chunkers chunkers;

    @Value("${rag.data.path:src/main/resources/rag-data}")
    private String ragDataPath;

    @Autowired
    public RagService(
            @Qualifier("hrKnowledgeStore")  EmbeddingStore<TextSegment> hrKnowledgeStore,
            @Qualifier("jobMarketStore")    EmbeddingStore<TextSegment> jobMarketStore,
            EmbeddingModel embeddingModel,
            Loaders loaders,
            Chunkers chunkers) {
        this.hrKnowledgeStore = hrKnowledgeStore;
        this.jobMarketStore   = jobMarketStore;
        this.embeddingModel   = embeddingModel;
        this.loaders          = loaders;
        this.chunkers         = chunkers;
    }

    // ── Startup ───────────────────────────────────────────────────────────────

    @PostConstruct
    public void init() {
        log.info("╔══════════════════════════════════════════╗");
        log.info("║     Initializing Dual RAG Pipeline       ║");
        log.info("╚══════════════════════════════════════════╝");
        try {
            initHrKnowledgeStore();
            initJobMarketStore();
            log.info("✅ RAG Pipeline Ready (HR store + Job store)");
        } catch (Exception e) {
            log.error("❌ Failed to initialize RAG pipeline", e);
        }
    }

    // ── HR Knowledge Store ────────────────────────────────────────────────────

    private void initHrKnowledgeStore() throws Exception {
        Path storePath = Paths.get(ragDataPath, "embeddings", "hr_store.json");

        if (Files.exists(storePath)) {
            log.info("[HR Store] ✓ Already exists at {}. Skipping ingestion.", storePath.toAbsolutePath());
            return;
        }

        Path rawPath = Paths.get(ragDataPath, "raw");
        if (!Files.exists(rawPath)) {
            Files.createDirectories(rawPath);
            log.warn("[HR Store] raw/ directory was missing — created. Add HR documents and restart.");
            return;
        }

        List<Document> docs = new ArrayList<>();
        
        Path hrRulesPath = rawPath.resolve("hr_rules");
        if (Files.exists(hrRulesPath)) {
            docs.addAll(loaders.loadDocumentsFromPath(hrRulesPath));
        }
        
        Path atsGuidesPath = rawPath.resolve("ats_guides");
        if (Files.exists(atsGuidesPath)) {
            docs.addAll(loaders.loadDocumentsFromPath(atsGuidesPath));
        }

        if (docs.isEmpty()) {
            log.warn("[HR Store] No HR rules or ATS guides documents found in {}", rawPath.toAbsolutePath());
            return;
        }

        log.info("[HR Store] Loaded {} document(s) from hr_rules/ats_guides. Chunking...", docs.size());
        List<TextSegment> segments = chunkers.smartSplitAll(docs);
        ingestAndPersist(segments, hrKnowledgeStore, storePath, "HR Store");
    }

    // ── Job Market Store ──────────────────────────────────────────────────────

    private void initJobMarketStore() throws Exception {
        Path storePath = Paths.get(ragDataPath, "embeddings", "job_store.json");

        if (Files.exists(storePath)) {
            log.info("[Job Store] ✓ Already exists at {}. Skipping ingestion.", storePath.toAbsolutePath());
            return;
        }

        Path jobsPath = Paths.get(ragDataPath, "processed", "jobs");
        if (!Files.exists(jobsPath)) {
            log.info("[Job Store] processed/jobs/ not found — skipping job market ingestion.");
            return;
        }

        List<Document> docs = loaders.loadDocumentsFromPath(jobsPath);
        if (docs.isEmpty()) {
            log.warn("[Job Store] No job documents found in {}", jobsPath.toAbsolutePath());
            return;
        }

        log.info("[Job Store] Loaded {} job document(s). Chunking...", docs.size());
        List<TextSegment> segments = chunkers.smartSplitAll(docs);
        ingestAndPersist(segments, jobMarketStore, storePath, "Job Store");
    }

    // ── Shared Ingest + Persist ───────────────────────────────────────────────

    private void ingestAndPersist(List<TextSegment> segments,
                                   EmbeddingStore<TextSegment> store,
                                   Path storePath,
                                   String label) throws IOException {

        List<Document> segmentDocs = segments.stream()
                .map(seg -> Document.from(seg.text(), seg.metadata()))
                .collect(Collectors.toList());

        EmbeddingStoreIngestor ingestor = EmbeddingStoreIngestor.builder()
                .embeddingModel(embeddingModel)
                .embeddingStore(store)
                .build();

        ingestor.ingest(segmentDocs);
        log.info("[{}] Embedded {} segment(s) into vector store.", label, segments.size());

        if (store instanceof InMemoryEmbeddingStore) {
            Files.createDirectories(storePath.getParent());
            ((InMemoryEmbeddingStore<TextSegment>) store).serializeToFile(storePath.toString());
            log.info("[{}] Saved to {}", label, storePath.toAbsolutePath());
        }
    }
}
