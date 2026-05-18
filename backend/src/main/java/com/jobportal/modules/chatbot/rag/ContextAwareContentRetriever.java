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
        String text = query.text().toLowerCase();

        boolean isHrQuery  = HR_SIGNALS.stream().anyMatch(text::contains);
        boolean isJobQuery = JOB_SIGNALS.stream().anyMatch(text::contains);

        if (isHrQuery && !isJobQuery) {
            log.debug("[RAG Router] HR Store ← \"{}\"", truncate(query.text()));
            return hrRetriever.retrieve(query);
        }

        if (isJobQuery && !isHrQuery) {
            log.debug("[RAG Router] Job Store ← \"{}\"", truncate(query.text()));
            return jobRetriever.retrieve(query);
        }

        // Câu hỏi tổng hợp hoặc không rõ → query cả hai, merge kết quả
        log.debug("[RAG Router] Both stores ← \"{}\"", truncate(query.text()));
        List<Content> merged = new ArrayList<>();
        merged.addAll(hrRetriever.retrieve(query));
        merged.addAll(jobRetriever.retrieve(query));
        return merged;
    }

    private String truncate(String text) {
        return text.length() > 90 ? text.substring(0, 90) + "…" : text;
    }
}
