package com.biznest.backend.service;

import com.biznest.backend.repository.BusinessListingRepository;
import com.biznest.backend.repository.UserRepository;
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
    
    // In a real app, you'd also autowire a ReviewRepository
    // @Autowired
    // private ReviewRepository reviewRepository;

    public Map<String, Object> getDashboardAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        long totalListings = businessListingRepository.count();
        long activeListings = businessListingRepository.countByStatus("Approved");
        long pendingListings = businessListingRepository.countByStatus("Pending");
        long totalUsers = userRepository.count();
        
        // Mocking review data for now, since there's no ReviewRepository/Service yet
        long pendingReviews = 12; 
        double averageRating = 4.7;

        analytics.put("totalListings", totalListings);
        analytics.put("activeListings", activeListings);
        analytics.put("pendingListings", pendingListings);
        analytics.put("totalUsers", totalUsers);
        analytics.put("pendingReviews", pendingReviews);
        analytics.put("averageRating", averageRating);
        
        // Mocking trends for now
        analytics.put("listingsTrend", "+5% from last month");
        analytics.put("usersTrend", "+12% from last month");
        analytics.put("reviewsTrend", "+8% from last month");
        analytics.put("ratingTrend", "+0.2 from last month");


        return analytics;
    }
} 