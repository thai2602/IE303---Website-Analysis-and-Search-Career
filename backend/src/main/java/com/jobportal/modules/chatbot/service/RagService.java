package com.jobportal.modules.chatbot.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.document.parser.TextDocumentParser;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class RagService {

    @Getter
    private EmbeddingStore<TextSegment> embeddingStore;

    @Getter
    private EmbeddingModel embeddingModel;

    @Value("${langchain.api-key}")
    private String apiKey;

    @Value("${langchain.base-url:http://localhost:1234/v1}")
    private String baseUrl;

    @Value("${langchain.embedding-model-name:text-embedding-nomic-embed-text-v1.5-embedding}")
    private String embeddingModelName;

    @Value("${rag.data.path:src/main/resources/rag-data}")
    private String ragDataPath;

    @PostConstruct
    public void init() {
        try {
            log.info("Initializing RAG Service...");
            this.embeddingStore = new InMemoryEmbeddingStore<>();
            
            // Using a default embedding model for parsing
            // Use dummy "demo" if API key is demo, otherwise OpenAI
            if (apiKey == null || apiKey.equals("demo")) {
                log.warn("Using demo API key. Embeddings will fail unless a valid key is provided.");
            }
            this.embeddingModel = OpenAiEmbeddingModel.builder()
                    .baseUrl(baseUrl)              // Trỏ tới LM Studio local server
                    .apiKey(apiKey)                // Bất kỳ chuỗi nào (LM Studio bỏ qua)
                    .modelName(embeddingModelName) // Model embedding đang load trong LM Studio
                    .build();

            Path path = Paths.get(ragDataPath);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                log.info("Created rag-data directory at {}", path.toAbsolutePath());
                return;
            }

            // Load documents from the directory (Supports PDF, Text, etc provided there are parsers)
            // By default we use a generic loader. For texts, standard parsing is enough. For PDF, using ApachePdfBoxDocumentParser.
            List<Document> documents = FileSystemDocumentLoader.loadDocuments(path, new TextDocumentParser());
            // It will load files. Note: For a robust system, configure a DocumentParser that checks extensions,
            // or just load text with TextDocumentParser. LangChain4j can map this nicely.

            if (!documents.isEmpty()) {
                EmbeddingStoreIngestor ingestor = EmbeddingStoreIngestor.builder()
                        .documentSplitter(dev.langchain4j.data.document.splitter.DocumentSplitters.recursive(500, 50))
                        .embeddingModel(embeddingModel)
                        .embeddingStore(embeddingStore)
                        .build();

                ingestor.ingest(documents);
                log.info("Ingested {} documents into the vector store.", documents.size());
            } else {
                log.info("No documents found in {}.", path.toAbsolutePath());
            }
        } catch (Exception e) {
            log.error("Failed to initialize RAG service: ", e);
        }
    }
}
