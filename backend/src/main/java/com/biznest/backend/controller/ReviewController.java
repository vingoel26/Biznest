package com.biznest.backend.controller;

import com.biznest.backend.model.Review;
import com.biznest.backend.service.ReviewService;
import com.biznest.backend.dto.ReviewRequest;
import com.biznest.backend.dto.ReviewResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {

    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@RequestBody ReviewRequest reviewRequest, 
                                             @RequestParam Long userId, 
                                             @RequestParam Long businessListingId) {
        logger.info("Received review creation request - userId: {}, businessListingId: {}, rating: {}", 
                   userId, businessListingId, reviewRequest.getRating());
        
        try {
            // Validate input
            if (reviewRequest.getRating() == null || reviewRequest.getRating() < 1 || reviewRequest.getRating() > 5) {
                logger.warn("Invalid rating provided: {}", reviewRequest.getRating());
                return ResponseEntity.badRequest().build();
            }
            
            if (reviewRequest.getComment() == null || reviewRequest.getComment().trim().isEmpty()) {
                logger.warn("Empty comment provided");
                return ResponseEntity.badRequest().build();
            }
            
            Review review = new Review();
            review.setRating(reviewRequest.getRating());
            review.setComment(reviewRequest.getComment().trim());
            
            Review createdReview = reviewService.createReview(review, userId, businessListingId);
            ReviewResponse response = convertToReviewResponse(createdReview);
            
            logger.info("Review created successfully - reviewId: {}", createdReview.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error creating review: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Unexpected error creating review: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReview(@PathVariable Long id) {
        Optional<Review> review = reviewService.getReview(id);
        return review.map(r -> ResponseEntity.ok(convertToReviewResponse(r)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/business/{businessListingId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByBusinessListing(@PathVariable Long businessListingId) {
        try {
            List<Review> reviews = reviewService.getReviewsByBusinessListing(businessListingId);
            List<ReviewResponse> responses = reviews.stream()
                .map(this::convertToReviewResponse)
                .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/business/{businessListingId}/page")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByBusinessListingPaginated(
            @PathVariable Long businessListingId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Review> reviews = reviewService.getReviewsByBusinessListing(businessListingId, pageable);
            Page<ReviewResponse> responses = reviews.map(this::convertToReviewResponse);
            return ResponseEntity.ok(responses);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByUser(@PathVariable Long userId) {
        try {
            List<Review> reviews = reviewService.getReviewsByUser(userId);
            List<ReviewResponse> responses = reviews.stream()
                .map(this::convertToReviewResponse)
                .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}/page")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByUserPaginated(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Review> reviews = reviewService.getReviewsByUser(userId, pageable);
            Page<ReviewResponse> responses = reviews.map(this::convertToReviewResponse);
            return ResponseEntity.ok(responses);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> updateReview(@PathVariable Long id, @RequestBody ReviewRequest reviewRequest) {
        logger.info("Received review update request - reviewId: {}, rating: {}", id, reviewRequest.getRating());
        
        try {
            // Validate input
            if (reviewRequest.getRating() == null || reviewRequest.getRating() < 1 || reviewRequest.getRating() > 5) {
                logger.warn("Invalid rating provided: {}", reviewRequest.getRating());
                return ResponseEntity.badRequest().build();
            }
            
            if (reviewRequest.getComment() == null || reviewRequest.getComment().trim().isEmpty()) {
                logger.warn("Empty comment provided");
                return ResponseEntity.badRequest().build();
            }
            
            Review review = new Review();
            review.setRating(reviewRequest.getRating());
            review.setComment(reviewRequest.getComment().trim());
            
            Review updatedReview = reviewService.updateReview(id, review);
            ReviewResponse response = convertToReviewResponse(updatedReview);
            
            logger.info("Review updated successfully - reviewId: {}", id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error updating review: {}", e.getMessage(), e);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Unexpected error updating review: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{id}/response")
    public ResponseEntity<ReviewResponse> addBusinessResponse(@PathVariable Long id, @RequestBody String response) {
        try {
            Review review = reviewService.addBusinessResponse(id, response);
            ReviewResponse reviewResponse = convertToReviewResponse(review);
            return ResponseEntity.ok(reviewResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/business/{businessListingId}/average-rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long businessListingId) {
        try {
            Double averageRating = reviewService.getAverageRatingByBusinessListing(businessListingId);
            if (averageRating != null) {
                // Round to 1 decimal place
                double roundedRating = Math.round(averageRating * 10.0) / 10.0;
                return ResponseEntity.ok(roundedRating);
            }
            return ResponseEntity.ok(0.0);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/business/{businessListingId}/count")
    public ResponseEntity<Long> getReviewCount(@PathVariable Long businessListingId) {
        try {
            Long count = reviewService.getReviewCountByBusinessListing(businessListingId);
            return ResponseEntity.ok(count);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/with-response")
    public ResponseEntity<List<ReviewResponse>> getReviewsWithBusinessResponse() {
        List<Review> reviews = reviewService.getReviewsWithBusinessResponse();
        List<ReviewResponse> responses = reviews.stream()
            .map(this::convertToReviewResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/without-response")
    public ResponseEntity<List<ReviewResponse>> getReviewsWithoutBusinessResponse() {
        List<Review> reviews = reviewService.getReviewsWithoutBusinessResponse();
        List<ReviewResponse> responses = reviews.stream()
            .map(this::convertToReviewResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/check-reviewed")
    public ResponseEntity<Boolean> hasUserReviewedBusiness(@RequestParam Long userId, 
                                                         @RequestParam Long businessListingId) {
        try {
            boolean hasReviewed = reviewService.hasUserReviewedBusiness(userId, businessListingId);
            return ResponseEntity.ok(hasReviewed);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private ReviewResponse convertToReviewResponse(Review review) {
        return new ReviewResponse(
            review.getId(),
            review.getUser() != null ? review.getUser().getUsername() : "Anonymous",
            review.getBusinessListing() != null ? review.getBusinessListing().getName() : "Unknown Business",
            review.getRating(),
            review.getComment(),
            review.getBusinessResponse(),
            review.getCreatedAt(),
            review.getUpdatedAt()
        );
    }
} 