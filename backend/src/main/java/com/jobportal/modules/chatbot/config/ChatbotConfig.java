package com.jobportal.modules.chatbot.config;

import com.jobportal.modules.chatbot.rag.ContextAwareContentRetriever;
import com.jobportal.modules.chatbot.rag.RerankContentRetriever;
import com.jobportal.modules.chatbot.service.CvAiService;
import com.jobportal.modules.chatbot.service.RagService;
import com.jobportal.modules.chatbot.tools.CvAgentTools;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.store.memory.chat.InMemoryChatMemoryStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ChatbotConfig {

    @Value("${langchain.chat.api-key}")
    private String apiKey;

    @Value("${langchain.chat.base-url:https://openrouter.ai/api/v1}")
    private String baseUrl;

    @Value("${langchain.chat.model-name:google/gemma-4-31b-it}")
    private String modelName;

    @Bean
    public ChatLanguageModel chatLanguageModel() {
        return OpenAiChatModel.builder()
                .baseUrl(baseUrl)
                .apiKey(apiKey)
                .modelName(modelName)
                .timeout(java.time.Duration.ofMinutes(5))
                .build();
    }

    /**
     * ChatMemoryProvider tạo ra bộ nhớ độc lập cho mỗi memoryId (userId /
     * sessionId).
     */
    @Bean
    public ChatMemoryProvider chatMemoryProvider() {
        InMemoryChatMemoryStore sharedStore = new InMemoryChatMemoryStore();
        return memoryId -> MessageWindowChatMemory.builder()
                .id(memoryId)
                .maxMessages(20)
                .chatMemoryStore(sharedStore)
                .build();
    }

    // ── Dual Retrievers ───────────────────────────────────────────────────────

    /**
     * HR Knowledge Retriever: truy vấn tiêu chí chấm CV, ATS rules, red-flags.
     * minScore cao hơn (0.70) vì HR docs rất specific, không cần lấy result mờ.
     */
    @Bean("hrContentRetriever")
    public ContentRetriever hrContentRetriever(RagService ragService) {
        ContentRetriever rawRetriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(ragService.getHrKnowledgeStore())
                .embeddingModel(ragService.getEmbeddingModel())
                .maxResults(24) // Stage 1: Vector DB retrieves Top-24 candidates
                .minScore(0.60) // Lower minScore so we don't miss relevant chunks before reranking
                .build();

        // Stage 2: Local BAAI Reranker re-scores down to Top-8
        return new RerankContentRetriever(rawRetriever, 8);
    }

    /**
     * Job Market Retriever: truy vấn dữ liệu CSV việc làm, JD, yêu cầu tuyển dụng.
     * minScore thấp hơn (0.55) vì job data đa dạng hơn và cần recall cao hơn.
     */
    @Bean("jobContentRetriever")
    public ContentRetriever jobContentRetriever(RagService ragService) {
        ContentRetriever rawRetriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(ragService.getJobMarketStore())
                .embeddingModel(ragService.getEmbeddingModel())
                .maxResults(18) // Stage 1: Vector DB retrieves Top-18 candidates
                .minScore(0.55)
                .build();

        // Stage 2: Local BAAI Reranker re-scores down to Top-6
        return new RerankContentRetriever(rawRetriever, 6);
    }

    /**
     * Context-Aware Router: phân tích câu hỏi → định tuyến sang đúng store.
     * Bean này được inject vào AiServices thay cho contentRetriever đơn.
     */
    @Bean
    public ContentRetriever contentRetriever(
            @org.springframework.beans.factory.annotation.Qualifier("hrContentRetriever") ContentRetriever hrRetriever,
            @org.springframework.beans.factory.annotation.Qualifier("jobContentRetriever") ContentRetriever jobRetriever) {
        return new ContextAwareContentRetriever(hrRetriever, jobRetriever);
    }

    // ── AI Service ────────────────────────────────────────────────────────────

    @Bean
    public CvAiService cvAiService(ChatLanguageModel chatLanguageModel,
            ChatMemoryProvider chatMemoryProvider,
            CvAgentTools cvAgentTools,
            ContentRetriever contentRetriever) {
        return AiServices.builder(CvAiService.class)
                .chatLanguageModel(chatLanguageModel)
                .chatMemoryProvider(chatMemoryProvider)
                .tools(cvAgentTools)
                .contentRetriever(contentRetriever)
                .build();
    }
}
