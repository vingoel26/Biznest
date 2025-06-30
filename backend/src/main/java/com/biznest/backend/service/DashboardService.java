package com.biznest.backend.service;

import com.biznest.backend.repository.BusinessListingRepository;
import com.biznest.backend.repository.UserRepository;
import com.biznest.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private BusinessListingRepository businessListingRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;

    public Map<String, Object> getDashboardAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        long totalListings = businessListingRepository.count();
        long activeListings = businessListingRepository.countByStatus("Approved");
        long pendingListings = businessListingRepository.countByStatus("Pending");
        long totalUsers = userRepository.count();
        
        // Get actual review data
        long totalReviews = reviewRepository.count();
        long pendingReviews = reviewRepository.findByBusinessResponseIsNull().size();
        
        // Calculate average rating across all reviews
        Double averageRating = reviewRepository.findAll().stream()
            .mapToDouble(review -> review.getRating())
            .average()
            .orElse(0.0);

        analytics.put("totalListings", totalListings);
        analytics.put("activeListings", activeListings);
        analytics.put("pendingListings", pendingListings);
        analytics.put("totalUsers", totalUsers);
        analytics.put("totalReviews", totalReviews);
        analytics.put("pendingReviews", pendingReviews);
        analytics.put("averageRating", Math.round(averageRating * 10.0) / 10.0); // Round to 1 decimal place
        
        // Calculate real trends (for now, we'll use simple calculations)
        // In a production app, you'd store historical data and calculate actual trends
        analytics.put("listingsTrend", "N/A"); // Would need historical data
        analytics.put("usersTrend", "N/A"); // Would need historical data  
        analytics.put("reviewsTrend", "N/A"); // Would need historical data
        analytics.put("ratingTrend", "N/A"); // Would need historical data

        return analytics;
    }
} 