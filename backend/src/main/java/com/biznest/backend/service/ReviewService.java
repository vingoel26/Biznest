package com.biznest.backend.service;

import com.biznest.backend.model.Review;
import com.biznest.backend.model.BusinessListing;
import com.biznest.backend.model.UserEntity;
import com.biznest.backend.repository.ReviewRepository;
import com.biznest.backend.repository.BusinessListingRepository;
import com.biznest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private BusinessListingRepository businessListingRepository;
    
    @Autowired
    private UserRepository userRepository;

    public Review createReview(Review review, Long userId, Long businessListingId) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        BusinessListing businessListing = businessListingRepository.findById(businessListingId)
            .orElseThrow(() -> new RuntimeException("Business listing not found"));
        
        // Check if user has already reviewed this business
        if (reviewRepository.existsByUserAndBusinessListing(user, businessListing)) {
            throw new RuntimeException("User has already reviewed this business");
        }
        
        review.setUser(user);
        review.setBusinessListing(businessListing);
        
        Review savedReview = reviewRepository.save(review);
        
        // Update business listing average rating
        updateBusinessListingRating(businessListing);
        
        return savedReview;
    }

    public Optional<Review> getReview(Long id) {
        return reviewRepository.findById(id);
    }

    public List<Review> getReviewsByBusinessListing(Long businessListingId) {
        BusinessListing businessListing = businessListingRepository.findById(businessListingId)
            .orElseThrow(() -> new RuntimeException("Business listing not found"));
        return reviewRepository.findByBusinessListingOrderByCreatedAtDesc(businessListing);
    }

    public List<Review> getReviewsByUser(Long userId) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return reviewRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Page<Review> getReviewsByBusinessListing(Long businessListingId, Pageable pageable) {
        BusinessListing businessListing = businessListingRepository.findById(businessListingId)
            .orElseThrow(() -> new RuntimeException("Business listing not found"));
        return reviewRepository.findByBusinessListing(businessListing, pageable);
    }

    public Page<Review> getReviewsByUser(Long userId, Pageable pageable) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return reviewRepository.findByUser(user, pageable);
    }

    public Review updateReview(Long id, Review updatedReview) {
        Review existing = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        
        existing.setRating(updatedReview.getRating());
        existing.setComment(updatedReview.getComment());
        Review savedReview = reviewRepository.save(existing);
        
        // Update business listing average rating after review update
        updateBusinessListingRating(existing.getBusinessListing());
        
        return savedReview;
    }

    public Review addBusinessResponse(Long reviewId, String response) {
        return reviewRepository.findById(reviewId)
            .map(existing -> {
                existing.setBusinessResponse(response);
                return reviewRepository.save(existing);
            })
            .orElseThrow(() -> new RuntimeException("Review not found"));
    }

    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        
        BusinessListing businessListing = review.getBusinessListing();
        reviewRepository.deleteById(id);
        
        // Update business listing average rating after deletion
        updateBusinessListingRating(businessListing);
    }

    public Double getAverageRatingByBusinessListing(Long businessListingId) {
        BusinessListing businessListing = businessListingRepository.findById(businessListingId)
            .orElseThrow(() -> new RuntimeException("Business listing not found"));
        return reviewRepository.getAverageRatingByBusinessListing(businessListing);
    }

    public Long getReviewCountByBusinessListing(Long businessListingId) {
        BusinessListing businessListing = businessListingRepository.findById(businessListingId)
            .orElseThrow(() -> new RuntimeException("Business listing not found"));
        return reviewRepository.getReviewCountByBusinessListing(businessListing);
    }

    public List<Review> getReviewsWithBusinessResponse() {
        return reviewRepository.findByBusinessResponseIsNotNull();
    }

    public List<Review> getReviewsWithoutBusinessResponse() {
        return reviewRepository.findByBusinessResponseIsNull();
    }

    public boolean hasUserReviewedBusiness(Long userId, Long businessListingId) {
        UserEntity user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        BusinessListing businessListing = businessListingRepository.findById(businessListingId)
            .orElseThrow(() -> new RuntimeException("Business listing not found"));
        return reviewRepository.existsByUserAndBusinessListing(user, businessListing);
    }

    private void updateBusinessListingRating(BusinessListing businessListing) {
        Double averageRating = reviewRepository.getAverageRatingByBusinessListing(businessListing);
        if (averageRating != null) {
            // Round to 1 decimal place
            double roundedRating = Math.round(averageRating * 10.0) / 10.0;
            businessListing.setRating(roundedRating);
            businessListingRepository.save(businessListing);
        }
    }
} 