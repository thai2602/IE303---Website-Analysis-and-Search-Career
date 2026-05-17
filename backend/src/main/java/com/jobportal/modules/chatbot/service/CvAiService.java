package com.jobportal.modules.chatbot.service;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

import com.jobportal.modules.chatbot.core.Prompts;

public interface CvAiService {

    @SystemMessage(Prompts.SYSTEM_PROMPT + "\n\n" + Prompts.CV_ANALYSIS_PROMPT)
    String chat(@MemoryId String memoryId, @UserMessage String userMessage);
}
