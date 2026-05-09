package com.jobportal.modules.chatbot.rag;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.inmemory.InMemoryEmbeddingStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VectorStoreConfig {

    /**
     * Cấu hình kết nối ChromaDB/FAISS (Sử dụng InMemoryEmbeddingStore tạm thời)
     */
    @Bean
    public EmbeddingStore<TextSegment> ragEmbeddingStore() {
        return new InMemoryEmbeddingStore<>();
    }
}
