package com.jobportal.modules.chatbot.tools;

import com.jobportal.modules.cv.CvService;
import com.jobportal.modules.cv.UserCv;
import com.jobportal.modules.cv.UserCvRepository;
import dev.langchain4j.agent.tool.Tool;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class CvAgentTools {

    private final CvService cvService;
    private final UserCvRepository userCvRepository;

    @Tool("Get all CVs of a specific user by their user ID. Returns basic info of the CVs including CV IDs.")
    public String getUserCvs(Long userId) {
        log.info("Tool called: getUserCvs for userId: {}", userId);
        List<UserCv> cvs = cvService.getUserCvs(userId);
        if (cvs == null || cvs.isEmpty()) {
            return "No CVs found for user ID: " + userId;
        }
        StringBuilder sb = new StringBuilder();
        for (UserCv cv : cvs) {
            sb.append("CV ID: ").append(cv.getId())
              .append(", Name: ").append(cv.getCvName())
              .append(", Job Title: ").append(cv.getJobTitle())
              .append("\n");
        }
        return sb.toString();
    }

    @Transactional(readOnly = true)
    @Tool("Get detailed information of a specific CV by its CV ID. Returns full name, job title, summary, email, skills, and experiences.")
    public String getCvDetails(Long cvId) {
        log.info("Tool called: getCvDetails for cvId: {}", cvId);
        return userCvRepository.findById(cvId)
                .map(cv -> String.format("CV ID: %d, Full Name: %s, Job Title: %s, Summary: %s, Phone: %s, Email: %s, Skills Count: %d, Experience Count: %d",
                        cv.getId(), cv.getFullName(), cv.getJobTitle(), cv.getSummary(), cv.getPhone(), cv.getEmail(), cv.getSkills().size(), cv.getExperiences().size()))
                .orElse("CV not found for ID: " + cvId);
    }

    @Transactional
    @Tool("Update the basic information of a specific CV. User must provide cvId and the new summary and new jobTitle.")
    public String updateCvBasicInfo(Long cvId, String newJobTitle, String newSummary) {
        log.info("Tool called: updateCvBasicInfo for cvId: {}", cvId);
        try {
            UserCv cv = userCvRepository.findById(cvId)
                    .orElseThrow(() -> new RuntimeException("CV not found"));
            
            if (newJobTitle != null && !newJobTitle.trim().isEmpty()) {
                cv.setJobTitle(newJobTitle);
            }
            if (newSummary != null && !newSummary.trim().isEmpty()) {
                cv.setSummary(newSummary);
            }
            userCvRepository.save(cv);
            return "CV ID " + cvId + " updated successfully. New Job Title: " + cv.getJobTitle() + ". New Summary: " + cv.getSummary();
        } catch (Exception e) {
            return "Failed to update CV: " + e.getMessage();
        }
    }
}
