package com.jobportal.modules.company;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.query.Param;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    @Query("SELECT c FROM Company c")
    List<Company> findAllWithPositions(Pageable pageable);

    @Query("SELECT c FROM Company c WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "c.isDeleted = false")
    List<Company> searchCompanies(@Param("search") String search, Pageable pageable);

    @Query("SELECT DISTINCT c FROM Company c LEFT JOIN FETCH c.positions WHERE c.slug = :slug")
    Optional<Company> findBySlugWithPositions(@Param("slug") String slug);
}
