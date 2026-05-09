package com.jobportal.modules.chatbot.rag;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;

@Configuration
public class Embeddings {

    @Value("${langchain.api-key:lm-studio}")
    private String apiKey;

    @Value("${langchain.base-url:http://localhost:1234/v1}")
    private String baseUrl;

    @Value("${langchain.embedding-model-name:text-embedding-nomic-embed-text-v1.5-embedding}")
    private String embeddingModelName;

    @Value("${langchain.dimension:768}")
    private int dimension;

    /**
     * Xử lý vector embeddings
     */
    @Bean
    public EmbeddingModel ragEmbeddingModel() {
        return OpenAiEmbeddingModel.builder()
                .baseUrl(baseUrl)
                .apiKey(apiKey)
                .modelName(embeddingModelName)
                .build();
    }
}
