package com.jobportal.modules.chatbot.config;

import com.jobportal.modules.chatbot.service.CvAiService;
import com.jobportal.modules.chatbot.service.RagService;
import com.jobportal.modules.chatbot.tools.CvAgentTools;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.service.AiServices;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatbotConfig {

    @Value("${langchain.api-key}")
    private String apiKey;

    @Value("${langchain.base-url:http://localhost:1234/v1}")
    private String baseUrl;

    @Value("${langchain.model-name:llama-3.2-1b-instruct}")
    private String modelName;

    @Bean
    public ChatLanguageModel chatLanguageModel() {
        return OpenAiChatModel.builder()
                .baseUrl(baseUrl)    // Trỏ tới LM Studio local server
                .apiKey(apiKey)      // Bất kỳ chuỗi nào (LM Studio bỏ qua)
                .modelName(modelName)
                .timeout(java.time.Duration.ofMinutes(5)) // Tăng timeout lên 5 phút
                .build();
    }

    @Bean
    public ChatMemory chatMemory() {
        // Keeps the last 20 messages in memory for context
        return MessageWindowChatMemory.withMaxMessages(20);
    }

    @Bean
    public ContentRetriever contentRetriever(RagService ragService) {
        return EmbeddingStoreContentRetriever.builder()
                .embeddingStore(ragService.getEmbeddingStore())
                .embeddingModel(ragService.getEmbeddingModel())
                .maxResults(3) // Fetch top 3 closest references
                .minScore(0.6)
                .build();
    }

    @Bean
    public CvAiService cvAiService(ChatLanguageModel chatLanguageModel,
                                   ChatMemory chatMemory,
                                   CvAgentTools cvAgentTools,
                                   ContentRetriever contentRetriever) {
        return AiServices.builder(CvAiService.class)
                .chatLanguageModel(chatLanguageModel)
                .chatMemory(chatMemory)
                .tools(cvAgentTools)
                .contentRetriever(contentRetriever)
                .build();
    }
}
