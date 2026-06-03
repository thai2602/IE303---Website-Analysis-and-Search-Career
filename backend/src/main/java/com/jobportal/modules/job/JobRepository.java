package com.jobportal.modules.job;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    Optional<Job> findBySlug(String slug);

    @Query("SELECT j FROM Job j WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(j.company.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(j.locationCity) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:jobType IS NULL OR :jobType = '' OR j.jobType = :jobType) AND " +
           "(:jobLevel IS NULL OR :jobLevel = '' OR j.jobLevel = :jobLevel) AND " +
           "j.isDeleted = false")
    List<Job> searchJobs(
            @Param("search") String search,
            @Param("location") String location,
            @Param("jobType") String jobType,
            @Param("jobLevel") String jobLevel,
            Pageable pageable);
}
