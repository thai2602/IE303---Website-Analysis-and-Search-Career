package com.jobportal.modules.chatbot.rag;

import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import org.springframework.stereotype.Component;

@Component
public class Chunkers {

    /**
     * Cấu hình băm tài liệu (RecursiveCharacterTextSplitter equivalent in Langchain4j)
     */
    public DocumentSplitter getRecursiveSplitter() {
        // Chunk size 500 characters, overlap 50 characters
        return DocumentSplitters.recursive(500, 50);
    }
}