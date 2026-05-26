package com.jobportal.modules.chatbot.rag;

import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Query;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Context-Aware Query Router.
 *
 * Phân tích nội dung câu hỏi và định tuyến sang đúng vector store:
 *
 *   ┌─────────────────────────────┬─────────────────────────┐
 *   │ Câu hỏi chứa HR signals     │ → hrRetriever           │
 *   │ Câu hỏi chứa Job signals    │ → jobRetriever          │
 *   │ Câu hỏi tổng hợp / mơ hồ   │ → cả hai (merge)        │
 *   └─────────────────────────────┴─────────────────────────┘
 */
@Slf4j
@RequiredArgsConstructor
public class ContextAwareContentRetriever implements ContentRetriever {

    private final ContentRetriever hrRetriever;
    private final ContentRetriever jobRetriever;

    /** Từ khóa liên quan đến đánh giá CV / tiêu chí HR */
    private static final Set<String> HR_SIGNALS = Set.of(
            "chấm điểm", "đánh giá cv", "nhận xét cv", "phân tích cv",
            "review cv", "cải thiện cv", "tối ưu cv", "audit cv",
            "ats", "applicant tracking", "tiêu chí", "khung chấm",
            "red flag", "điểm mạnh", "điểm yếu", "hồ sơ của tôi",
            "cv của tôi", "bộ hồ sơ", "hr", "nhà tuyển dụng đánh giá",
            "score", "bullet point", "action verb", "quantif"
    );

    /** Từ khóa liên quan đến thị trường việc làm / JD */
    private static final Set<String> JOB_SIGNALS = Set.of(
            "việc làm", "tìm việc", "job", "lương", "mức lương",
            "yêu cầu tuyển dụng", "mô tả công việc", "tuyển dụng",
            "vị trí tuyển", "cơ hội nghề nghiệp", "thị trường việc làm",
            "salary", "jd", "job description", "hiring", "recruitment",
            "kỹ năng cần có", "ngành it tuyển", "frontend developer tuyển"
    );

    @Override
    public List<Content> retrieve(Query query) {
        String originalText = query.text();
        String cleanText = cleanQueryText(originalText);
        Query cleanQuery = Query.from(cleanText);

        String text = originalText.toLowerCase();

        boolean isHrQuery  = HR_SIGNALS.stream().anyMatch(text::contains);
        boolean isJobQuery = JOB_SIGNALS.stream().anyMatch(text::contains);

        if (isHrQuery && !isJobQuery) {
            log.debug("[RAG Router] HR Store ← \"{}\"", truncate(cleanText));
            return hrRetriever.retrieve(cleanQuery);
        }

        if (isJobQuery && !isHrQuery) {
            log.debug("[RAG Router] Job Store ← \"{}\"", truncate(cleanText));
            return jobRetriever.retrieve(cleanQuery);
        }

        // Câu hỏi tổng hợp hoặc không rõ → query cả hai, merge kết quả
        log.debug("[RAG Router] Both stores ← \"{}\"", truncate(cleanText));
        List<Content> merged = new ArrayList<>();
        merged.addAll(hrRetriever.retrieve(cleanQuery));
        merged.addAll(jobRetriever.retrieve(cleanQuery));
        return merged;
    }

    /**
     * Dọn dẹp câu truy vấn: Loại bỏ các khối JSON CV khổng lồ trước khi đem đi tìm kiếm Vector.
     * Chỉ giữ lại phần chỉ thị (instruction) của người dùng nhằm đảm bảo Vector Match chính xác.
     */
    private String cleanQueryText(String text) {
        if (text == null) return "";
        
        // Loại bỏ block JSON nếu có (tìm từ dấu { đầu tiên đến } cuối cùng)
        int firstBrace = text.indexOf('{');
        int lastBrace = text.lastIndexOf('}');
        
        if (firstBrace != -1 && lastBrace != -1 && lastBrace > firstBrace) {
            String prefix = text.substring(0, firstBrace).trim();
            String suffix = text.substring(lastBrace + 1).trim();
            
            // Loại bỏ các từ mang tính kỹ thuật/chuyển tiếp
            prefix = prefix.replaceAll("(?i)dữ liệu sau\\s*\\(json\\):?", "");
            prefix = prefix.replaceAll("(?i)dựa trên\\s*$", "");
            
            String combined = (prefix + " " + suffix).trim();
            if (!combined.isEmpty()) {
                return combined;
            }
        }
        
        // Nếu không có JSON, nhưng chuỗi quá dài -> lấy 250 ký tự đầu và cuối
        if (text.length() > 600) {
            return text.substring(0, 250) + " " + text.substring(text.length() - 250);
        }
        
        return text;
    }

    private String truncate(String text) {
        return text.length() > 90 ? text.substring(0, 90) + "…" : text;
    }
}
