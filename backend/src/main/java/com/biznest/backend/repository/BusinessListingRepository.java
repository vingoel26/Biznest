package com.biznest.backend.repository;

import com.biznest.backend.model.BusinessListing;
import com.biznest.backend.model.Category;
import com.biznest.backend.model.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusinessListingRepository extends JpaRepository<BusinessListing, Long> {
    Page<BusinessListing> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<BusinessListing> findByLocationContainingIgnoreCase(String location, Pageable pageable);
    Page<BusinessListing> findByCategory(Category category, Pageable pageable);
    List<BusinessListing> findByCategory(Category category);
    Page<BusinessListing> findByOwner(UserEntity owner, Pageable pageable);
    List<BusinessListing> findByOwner(UserEntity owner);
} 