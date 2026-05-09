package com.jobportal.modules.application;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserIdOrderByAppliedAtDesc(Long userId);
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
}
