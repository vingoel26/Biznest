package com.biznest.backend.repository;

import com.biznest.backend.model.Review;
import com.biznest.backend.model.BusinessListing;
import com.biznest.backend.model.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Find all reviews for a specific business listing
    List<Review> findByBusinessListingOrderByCreatedAtDesc(BusinessListing businessListing);
    
    // Find all reviews by a specific user
    List<Review> findByUserOrderByCreatedAtDesc(UserEntity user);
    
    // Find reviews for a business listing with pagination
    Page<Review> findByBusinessListing(BusinessListing businessListing, Pageable pageable);
    
    // Find reviews by user with pagination
    Page<Review> findByUser(UserEntity user, Pageable pageable);
    
    // Find reviews with business response (for admin dashboard)
    List<Review> findByBusinessResponseIsNotNull();
    
    // Find reviews without business response (pending responses)
    List<Review> findByBusinessResponseIsNull();
    
    // Get average rating for a business listing
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.businessListing = :businessListing")
    Double getAverageRatingByBusinessListing(@Param("businessListing") BusinessListing businessListing);
    
    // Get count of reviews for a business listing
    @Query("SELECT COUNT(r) FROM Review r WHERE r.businessListing = :businessListing")
    Long getReviewCountByBusinessListing(@Param("businessListing") BusinessListing businessListing);
    
    // Check if user has already reviewed a business listing
    boolean existsByUserAndBusinessListing(UserEntity user, BusinessListing businessListing);
} 