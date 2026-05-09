package com.jobportal.modules.chatbot.controller;

import com.jobportal.modules.chatbot.service.CvAiService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final CvAiService cvAiService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        try {
            String aiMessage = cvAiService.chat(request.getMessage());
            return ResponseEntity.ok(new ChatResponse(aiMessage));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ChatResponse("Lỗi xử lý yêu cầu: " + e.getMessage()));
        }
    }

    @Data
    public static class ChatRequest {
        private String message;
    }

    @Data
    public static class ChatResponse {
        private String reply;

        public ChatResponse(String reply) {
            this.reply = reply;
        }
    }
}
