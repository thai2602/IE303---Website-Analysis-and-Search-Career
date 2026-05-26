package com.jobportal.modules.chatbot.rag;

import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.segment.TextSegment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Component
public class Chunkers {

    // ── Ngưỡng kích thước ───────────────────────────────────────────────────
    /**
     * Kích thước tối đa (ký tự) của một Markdown section trước khi cần split tiếp
     */
    private static final int SECTION_MAX_CHARS = 800;
    /** Overlap cho fallback splitter */
    private static final int SECTION_OVERLAP = 150;

    // ── Regex tìm Markdown header từ level 1 đến 3 ──────────────────────────
    private static final Pattern HEADER_PATTERN = Pattern.compile("(?m)^(#{1,3})\\s+(.+)$");

    // ── Splitter fallback dùng cho text thông thường / section dài ──────────
    private final DocumentSplitter fallbackSplitter = DocumentSplitters.recursive(SECTION_MAX_CHARS, SECTION_OVERLAP);

    // ────────────────────────────────────────────────────────────────────────
    // Public API: chọn splitter phù hợp với Document
    // ────────────────────────────────────────────────────────────────────────

    /**
     * Chọn chiến lược chunking tối ưu dựa trên loại tài liệu:
     * - job_description (từ CSV): mỗi document đã là 1 chunk → passthrough
     * - Markdown có headers (##): dùng Header-Based Splitter
     * - Còn lại: Recursive 800/150
     */
    public List<TextSegment> smartSplit(Document document) {
        String sourceType = document.metadata().getString("source_type");

        // CSV Job Description: đã được cắt theo từng row ở Loaders → giữ nguyên
        if ("job_description".equals(sourceType)) {
            return List.of(TextSegment.from(document.text(), copyMetadata(document.metadata())));
        }

        // Markdown có headers → Header-Based Semantic Splitting
        if (hasMarkdownHeaders(document.text())) {
            List<TextSegment> segments = splitByMarkdownHeaders(document);
            log.debug("Markdown header split → {} segments from \"{}\"",
                    segments.size(), document.metadata().getString("file_name"));
            return segments;
        }

        // Fallback: Recursive character splitter 800/150
        List<TextSegment> segments = fallbackSplitter.split(document);
        log.debug("Recursive split → {} segments from \"{}\"",
                segments.size(), document.metadata().getString("file_name"));
        return segments;
    }

    /**
     * Phiên bản batch của smartSplit — áp dụng cho toàn bộ danh sách documents.
     */
    public List<TextSegment> smartSplitAll(List<Document> documents) {
        List<TextSegment> all = new ArrayList<>();
        for (Document doc : documents) {
            all.addAll(smartSplit(doc));
        }
        return all;
    }

    /**
     * Splitter đơn giản 800/150 — giữ lại để RagService có thể dùng
     * khi cần giao cho EmbeddingStoreIngestor standard API.
     */
    public DocumentSplitter getRecursiveSplitter() {
        return DocumentSplitters.recursive(SECTION_MAX_CHARS, SECTION_OVERLAP);
    }

    // ────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ────────────────────────────────────────────────────────────────────────

    /** Kiểm tra văn bản có chứa ít nhất một Markdown header không */
    private boolean hasMarkdownHeaders(String text) {
        return HEADER_PATTERN.matcher(text).find();
    }

    /**
     * Header-Based Splitter:
     * 1. Tìm tất cả vị trí header (# / ## / ###)
     * 2. Mỗi khoảng giữa hai header = một section
     * 3. Nếu section > SECTION_MAX_CHARS → cắt tiếp bằng fallback
     * 4. Mỗi TextSegment được gắn metadata: header_title, section_index
     */
    private List<TextSegment> splitByMarkdownHeaders(Document document) {
        String text = document.text();
        Metadata baseMetadata = document.metadata();

        List<TextSegment> result = new ArrayList<>();
        Matcher matcher = HEADER_PATTERN.matcher(text);

        // Thu thập vị trí đầu các header
        List<int[]> headerPositions = new ArrayList<>(); // [start, end, titleStart, titleEnd]
        while (matcher.find()) {
            headerPositions.add(new int[] { matcher.start(), matcher.end(), matcher.start(2), matcher.end(2) });
        }

        if (headerPositions.isEmpty()) {
            // Không tìm được header nào (edge case) → fallback
            return fallbackSplitter.split(document);
        }

        int sectionIndex = 0;

        // Nếu có text TRƯỚC header đầu tiên → tạo chunk "preamble"
        int firstHeaderStart = headerPositions.get(0)[0];
        if (firstHeaderStart > 0) {
            String preamble = text.substring(0, firstHeaderStart).strip();
            if (!preamble.isEmpty()) {
                result.addAll(wrapSection(preamble, "Preamble", sectionIndex++, baseMetadata));
            }
        }

        // Duyệt từng section (header[i] → header[i+1])
        for (int i = 0; i < headerPositions.size(); i++) {
            // Nội dung section (bao gồm cả dòng header để giữ ngữ cảnh)
            int sectionContentEnd = (i + 1 < headerPositions.size())
                    ? headerPositions.get(i + 1)[0]
                    : text.length();

            // Lấy tiêu đề của section này
            String headerTitle = text.substring(
                    headerPositions.get(i)[2],
                    headerPositions.get(i)[3]).strip();

            // Nội dung section (bao gồm cả dòng header để giữ ngữ cảnh)
            String sectionText = text.substring(headerPositions.get(i)[0], sectionContentEnd).strip();

            if (!sectionText.isEmpty()) {
                result.addAll(wrapSection(sectionText, headerTitle, sectionIndex++, baseMetadata));
            }
        }

        return result;
    }

    /**
     * Wrap một section text thành TextSegment(s).
     * Nếu section quá dài → cắt tiếp bằng fallback splitter trước khi wrap.
     */
    private List<TextSegment> wrapSection(String sectionText, String headerTitle,
            int sectionIndex, Metadata baseMetadata) {
        List<TextSegment> out = new ArrayList<>();

        if (sectionText.length() <= SECTION_MAX_CHARS) {
            // Section đủ nhỏ → giữ nguyên
            Metadata meta = copyMetadata(baseMetadata);
            meta.put("header_title", headerTitle);
            meta.put("section_index", String.valueOf(sectionIndex));
            out.add(TextSegment.from(sectionText, meta));
        } else {
            // Section quá lớn → cắt tiếp bằng recursive splitter
            Document tempDoc = Document.from(sectionText, copyMetadata(baseMetadata));
            List<TextSegment> subSegments = fallbackSplitter.split(tempDoc);
            for (int j = 0; j < subSegments.size(); j++) {
                Metadata meta = copyMetadata(baseMetadata);
                meta.put("header_title", headerTitle);
                meta.put("section_index", sectionIndex + "." + j);
                out.add(TextSegment.from(subSegments.get(j).text(), meta));
            }
        }
        return out;
    }

    /** Tạo bản sao Metadata để tránh mutation chung */
    private Metadata copyMetadata(Metadata source) {
        // Trong v0.29.1, Metadata.put chỉ nhận (String, String)
        // toMap() trả Map<String,Object> nên phải cast từng value sang String
        Metadata copy = new Metadata();
        source.toMap().forEach((k, v) -> {
            if (v != null)
                copy.put(k, v.toString());
        });
        return copy;
    }
}