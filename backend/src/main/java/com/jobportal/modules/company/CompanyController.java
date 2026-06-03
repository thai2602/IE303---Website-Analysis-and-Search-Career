package com.jobportal.modules.company;

import java.util.List;

import com.jobportal.common.OffsetBasedPageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "*")
public class CompanyController {

    private final CompanyRepository companyRepository;

    public CompanyController(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @GetMapping
    public List<Company> getAllCompanies(
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search) {
        Pageable pageable = new OffsetBasedPageRequest(offset, limit);
        if (search != null && !search.trim().isEmpty()) {
            return companyRepository.searchCompanies(search, pageable);
        }
        return companyRepository.findAllWithPositions(pageable);
    }

    @GetMapping("/{slug}")
    public org.springframework.http.ResponseEntity<Company> getCompanyBySlug(@PathVariable String slug) {
        // Remove trailing :number pattern if present (e.g., "slug:1" -> "slug")
        String cleanSlug = slug.replaceAll(":\\d+$", "");
        
        return companyRepository.findBySlugWithPositions(cleanSlug)
                .map(org.springframework.http.ResponseEntity::ok)
                .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }
}
