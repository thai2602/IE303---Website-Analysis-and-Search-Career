package com.jobportal.modules.cv;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.modules.cv.dto.UserCvRequestDTO;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.parser.apache.pdfbox.ApachePdfBoxDocumentParser;
import dev.langchain4j.model.chat.ChatLanguageModel;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CvExtractionAgnosticService {

    private final ChatLanguageModel chatLanguageModel;
    private final ObjectMapper objectMapper;

    // Prompt được xây dựng bọc thép, ép trả về định dạng JSON markdown
    private static final String CV_EXTRACTION_PROMPT = """
        Bạn là một hệ thống trích xuất dữ liệu CV tự động. Nhiệm vụ của bạn là đọc nội dung văn bản CV dưới đây và điền thông tin vào định dạng JSON yêu cầu.
        
        QUY TẮC BẮT BUỘC:
        1. CHỈ TRẢ VỀ DUY NHẤT một block code chứa JSON. KHÔNG giải thích, KHÔNG thêm bất kỳ văn bản nào trước hoặc sau JSON.
        2. Dữ liệu phải được bọc trong markdown block: ```json và ```
        3. Tuyệt đối tuân thủ chính xác các key, bao gồm cả các object lồng nhau (nested objects) trong JSON mẫu dưới đây. Không tự ý đổi tên key (ví dụ: dùng "education" chứ không dùng "educations").
        4. Nếu thông tin nào không có trong CV, hãy gán giá trị là null (đối với chuỗi/số/object) hoặc mảng rỗng [] (đối với danh sách).
        5. Đối với các trường hệ thống không có trong text CV (như id, avatar, settings), hãy gán null hoặc giữ nguyên giá trị mặc định như trong mẫu.
        6. Lọc bỏ các thông tin thừa không thuộc bất kỳ trường nào trong cấu trúc JSON.
        
        JSON MẪU ĐÍCH:
        ```json
        {
          "title": "Tiêu đề CV (VD: Frontend Developer CV)",
          "fullName": "Tên đầy đủ",
          "jobTitle": "Vị trí công việc",
          "email": "Email",
          "phone": "Số điện thoại",
          "location": "Địa chỉ / Khu vực",
          "avatarUrl": null,
          "summary": "Tóm tắt bản thân",
          "skills": [
            {
              "skillName": "Tên kỹ năng (VD: JavaScript, React)",
              "level": "Mức độ thành thạo (VD: Beginner, Intermediate, Advanced)"
            }
          ],
          "experiences": [
            {
              "company": "Tên công ty",
              "position": "Vị trí",
              "startDate": "YYYY-MM",
              "endDate": "YYYY-MM hoặc Present",
              "description": "Mô tả công việc",
              "technologies": ["Công nghệ 1", "Công nghệ 2"]
            }
          ],
          "projects": [
            {
              "name": "Tên dự án",
              "description": "Mô tả dự án",
              "technologies": ["Công nghệ 1", "Công nghệ 2"],
              "link": "Link dự án"
            }
          ],
          "educations": [
            {
              "school": "Tên trường",
              "major": "Chuyên ngành",
              "startDate": "YYYY",
              "endDate": "YYYY hoặc Present"
            }
          ],
          "settings": {
            "themeColor": "#2563eb",
            "fontFamily": "Inter",
            "layout": "two-column"
          }
        }
        ```
        
        NỘI DUNG CV CẦN TRÍCH XUẤT:
        %s
        """;

    public CvExtractionAgnosticService(ChatLanguageModel chatLanguageModel) {
        this.chatLanguageModel = chatLanguageModel;
        this.objectMapper = new ObjectMapper()
                // Bỏ qua các key bị model tự chế thêm để không gây lỗi parse
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false); 
    }

    /**
     * Hàm chính: Đọc PDF -> Trích xuất Text -> Đưa vào LLM -> Regex bóc tách JSON -> Parse ra Object
     */
    public UserCvRequestDTO extractCvData(MultipartFile file) throws IOException {
        // 1. Đọc file PDF sang Text
        String cvText = parsePdfToText(file);

        // 2. Format Prompt
        String finalPrompt = String.format(CV_EXTRACTION_PROMPT, cvText);

        // 3. Gọi Model (Bất kể là Llama 3, Gemma 4, hay GPT)
        String llmResponse = chatLanguageModel.generate(finalPrompt);

        // 4. Bóc tách JSON
        String jsonStr = extractJsonFromMarkdown(llmResponse);
        if (jsonStr == null || jsonStr.trim().isEmpty()) {
            throw new RuntimeException("LLM không trả về định dạng JSON hợp lệ.");
        }

        // 5. Parse JSON thành DTO
        try {
            return objectMapper.readValue(jsonStr, UserCvRequestDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi parse JSON từ LLM: " + e.getMessage());
        }
    }

    private String parsePdfToText(MultipartFile file) throws IOException {
        ApachePdfBoxDocumentParser parser = new ApachePdfBoxDocumentParser();
        Document document = parser.parse(file.getInputStream());
        return document.text();
    }

    private String extractJsonFromMarkdown(String text) {
        Pattern pattern = Pattern.compile("```(?:json)?\\s*([\\s\\S]*?)\\s*```", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        
        // Fallback: Kiểm tra xem toàn bộ câu trả lời có phải là JSON thuần không
        if (text.trim().startsWith("{") && text.trim().endsWith("}")) {
            return text.trim();
        }
        
        return null;
    }
}
