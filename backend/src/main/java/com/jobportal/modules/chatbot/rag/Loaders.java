package com.jobportal.modules.chatbot.rag;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.document.parser.apache.pdfbox.ApachePdfBoxDocumentParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.util.Collections;
import java.util.List;

@Slf4j
@Component
public class Loaders {

    /**
     * Đọc file PDF, Word từ thư mục cấu hình
     */
    public List<Document> loadDocumentsFromPath(Path path) {
        try {
            log.info("Loading documents from path: {}", path.toAbsolutePath());
            return FileSystemDocumentLoader.loadDocuments(path, new ApachePdfBoxDocumentParser());
        } catch (Exception e) {
            log.error("Error loading documents from path: {}", path.toAbsolutePath(), e);
            return Collections.emptyList();
        }
    }
}
