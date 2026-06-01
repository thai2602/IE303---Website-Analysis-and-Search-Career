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

    @Query("SELECT DISTINCT c FROM Company c LEFT JOIN FETCH c.positions")
    List<Company> findAllWithPositions(Pageable pageable);

    @Query("SELECT DISTINCT c FROM Company c LEFT JOIN FETCH c.positions WHERE c.slug = :slug")
    Optional<Company> findBySlugWithPositions(@Param("slug") String slug);
}
