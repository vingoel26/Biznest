package com.biznest.backend.repository;

import com.biznest.backend.model.BusinessListing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusinessListingRepository extends JpaRepository<BusinessListing, Long> {
    Page<BusinessListing> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<BusinessListing> findByCategoryContainingIgnoreCase(String category, Pageable pageable);
    Page<BusinessListing> findByLocationContainingIgnoreCase(String location, Pageable pageable);
    Page<BusinessListing> findByNameContainingIgnoreCaseAndCategoryContainingIgnoreCaseAndLocationContainingIgnoreCase(
        String name, String category, String location, Pageable pageable);

    // Get all listings by category (not paginated)
    List<BusinessListing> findByCategoryIgnoreCase(String category);
} 