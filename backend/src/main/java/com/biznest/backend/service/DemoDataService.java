package com.biznest.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.biznest.backend.model.UserEntity;
import com.biznest.backend.model.BusinessListing;
import com.biznest.backend.model.Category;
import com.biznest.backend.model.Review;
import com.biznest.backend.repository.BusinessListingRepository;
import com.biznest.backend.repository.CategoryRepository;
import com.biznest.backend.repository.ReviewRepository;
import java.util.HashSet;
import java.util.Set;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class DemoDataService {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private BusinessListingRepository businessListingRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Transactional
    public void seedDemoData() {
        // Create admin user
        String adminUsername = "BIZNEST.CREATOR";
        if (!userDetailsService.userExists(adminUsername)) {
            Set<String> roles = new HashSet<>();
            roles.add("ROLE_ADMIN");
            UserEntity admin = new UserEntity(
                    adminUsername,
                    "Biznest.Creator@admin.com",
                    "password123",
                    roles,
                    "Biznest Creator",
                    "Founder of Biznest platform",
                    "Lucknow, India",
                    "https://biznest.com",
                    "/images/defaultUserPicture.png"
            );
            userDetailsService.addUser(admin);
        }

        // Create demo users if they don't exist
        createDemoUsers();

        // Fetch the managed admin entity for use as owner
        UserEntity admin = userDetailsService.getUserByUsername(adminUsername);

        // Seed initial categories if none exist
        if (categoryRepository.count() == 0) {
            categoryRepository.saveAll(Arrays.asList(
                Category.builder().name("Restaurants").description("Food and dining establishments").build(),
                Category.builder().name("Shopping").description("Shops, malls, and retail").build(),
                Category.builder().name("Education").description("Schools, colleges, and educational institutions").build(),
                Category.builder().name("Accommodation").description("Hostels, hotels, and places to stay").build(),
                Category.builder().name("Health & Beauty").description("Spas, salons, and wellness").build(),
                Category.builder().name("Automotive").description("Auto repair and vehicle services").build()
            ));
        }

        // Seed initial business listings if none exist
        if (businessListingRepository.count() == 0) {
            // Fetch categories
            Category restaurants = categoryRepository.findByName("Restaurants");
            Category shopping = categoryRepository.findByName("Shopping");
            Category education = categoryRepository.findByName("Education");
            Category accommodation = categoryRepository.findByName("Accommodation");
            Category health = categoryRepository.findByName("Health & Beauty");
            Category automotive = categoryRepository.findByName("Automotive");
            
            businessListingRepository.saveAll(Arrays.asList(
                BusinessListing.builder()
                    .name("Tunday Kebabi")
                    .category(restaurants)
                    .owner(admin)
                    .location("Aminbad")
                    .status("Approved")
                    .description("Best Kebabs in town! Famous for their melt-in-mouth kebabs and biryanis. A must-visit for food lovers.")
                    .address("Aminbad, Lucknow")
                    .phone("+91 7362526262")
                    .businessHours("9:00 AM - 10:00 PM")
                    .rating(4.8)
                    .imageUrl("/images/restaurant-image.webp")
                    .build(),
                BusinessListing.builder()
                    .name("Phoenix Palassio")
                    .category(shopping)
                    .owner(admin)
                    .location("Ahamamau")
                    .status("Approved")
                    .description("Your one-stop shop for everything! From fashion to electronics, we have it all.")
                    .address("Near Stadium, Ahamamau")
                    .phone("+91 7436283929")
                    .businessHours("10:00 AM - 9:00 PM")
                    .rating(4.5)
                    .imageUrl("/images/shopping.webp")
                    .build(),
                BusinessListing.builder()
                    .name("IIIT Lucknow")
                    .category(education)
                    .owner(admin)
                    .location("Ahamamau")
                    .status("Approved")
                    .description("The world is at IIIT Lucknow, where are you? Premier institute for technology and innovation.")
                    .address("Near Harmany Park, Ahamamau")
                    .phone("+91 7436283929")
                    .businessHours("8:00 AM - 5:00 PM")
                    .rating(4.9)
                    .imageUrl("/images/entertainment.webp")
                    .build(),
                BusinessListing.builder()
                    .name("Saroj Hostel")
                    .category(accommodation)
                    .owner(admin)
                    .location("Campus Area")
                    .status("Pending")
                    .description("Best hostel in the whole town! Comfortable accommodation for students and travelers.")
                    .address("Campus Area, Lucknow")
                    .phone("+91 7436283929")
                    .businessHours("24/7")
                    .rating(4.2)
                    .imageUrl("/images/homeService.webp")
                    .build(),
                BusinessListing.builder()
                    .name("Luxury Spa & Wellness")
                    .category(health)
                    .owner(admin)
                    .location("Gomti nagar")
                    .status("Approved")
                    .description("Relax and rejuvenate with our premium services. Professional therapists and modern facilities.")
                    .address("Gomtinagar, Lucknow")
                    .phone("+91 7362526262")
                    .businessHours("9:00 AM - 8:00 PM")
                    .rating(4.7)
                    .imageUrl("/images/Beauty.webp")
                    .build(),
                BusinessListing.builder()
                    .name("Premium Auto Repair")
                    .category(automotive)
                    .owner(admin)
                    .location("Aishbagh")
                    .status("Pending")
                    .description("Expert mechanics for all your vehicle needs. Quality service guaranteed.")
                    .address("Aishbagh, Lucknow")
                    .phone("+91 7436283929")
                    .businessHours("8:00 AM - 6:00 PM")
                    .rating(4.6)
                    .imageUrl("/images/automotive.webp")
                    .build()
            ));
        }

        // Seed demo reviews for each business listing if none exist
        if (reviewRepository.count() == 0) {
            seedDemoReviews();
        }
    }

    private void createDemoUsers() {
        String[] demoUsers = {
            "vinayak_goel", "anjali_pai", "diksha_narayan", "Khushi", "taha", 
            "vaidik", "samay", "divyanshu", "aditya", "piyush"
        };
        
        String[] displayNames = {
            "vingw", "anjali", "diksha", "khushi", "taha",
            "vaidik", "samay", "divyanshu", "aditya", "piyush"
        };
        
        String[] bios = {
            "Food enthusiast and travel blogger",
            "Local business owner and community leader",
            "Student at IIIT Lucknow",
            "Professional photographer",
            "Tech entrepreneur",
            "Fitness trainer and wellness coach",
            "Retired teacher",
            "Young professional",
            "Freelance designer",
            "Healthcare worker"
        };

        for (int i = 0; i < demoUsers.length; i++) {
            if (!userDetailsService.userExists(demoUsers[i])) {
                Set<String> roles = new HashSet<>();
                roles.add("ROLE_USER");
                UserEntity user = new UserEntity(
                    demoUsers[i],
                    demoUsers[i] + "@example.com",
                    "password123",
                    roles,
                    displayNames[i],
                    bios[i],
                    "Lucknow, India",
                    null,
                    "/images/defaultUserPicture.png"
                );
                userDetailsService.addUser(user);
            }
        }
    }

    @Transactional
    private void seedDemoReviews() {
        List<BusinessListing> listings = businessListingRepository.findAll();
        List<String> demoUsers = Arrays.asList(
            "vinayak_goel", "anjali_pai", "diksha_narayan", "Khushi", "taha", 
            "vaidik", "samay", "divyanshu", "aditya", "piyush"
        );
        
        // Sample review comments for different business types
        String[][] restaurantComments = {
            {"Amazing kebabs! The meat was so tender and flavorful. Will definitely come back!", "Great food but a bit pricey.", "Best biryani in town! Highly recommended."},
            {"The service was excellent and the food was delicious.", "Good atmosphere but could be cleaner.", "Love their traditional recipes!"}
        };
        
        String[][] shoppingComments = {
            {"Huge variety of stores and great deals!", "Clean mall with good parking.", "Perfect place for shopping with family."},
            {"Some stores are expensive but quality is good.", "Great food court options.", "Convenient location and good security."}
        };
        
        String[][] educationComments = {
            {"Excellent faculty and modern facilities.", "Great learning environment for students.", "Proud to be part of this institution."},
            {"Good infrastructure but needs more practical exposure.", "Amazing campus life and opportunities.", "Quality education with industry connections."}
        };
        
        String[][] accommodationComments = {
            {"Clean rooms and friendly staff.", "Good location for students.", "Affordable and comfortable stay."},
            {"Basic amenities but good value for money.", "Safe and secure environment.", "Convenient for campus access."}
        };
        
        String[][] healthComments = {
            {"Relaxing experience with professional therapists.", "Clean facilities and skilled staff.", "Great for stress relief and wellness."},
            {"A bit expensive but worth the quality.", "Peaceful environment and good service.", "Highly recommend for self-care."}
        };
        
        String[][] automotiveComments = {
            {"Honest mechanics and fair pricing.", "Quick service and quality work.", "Trustworthy auto repair shop."},
            {"Good service but can be busy sometimes.", "Professional team and clean workshop.", "Reliable for all vehicle needs."}
        };
        
        Random random = new Random();
        
        for (BusinessListing listing : listings) {
            // Create 3-5 reviews per listing
            int numReviews = random.nextInt(3) + 3; // 3-5 reviews
            
            for (int i = 0; i < numReviews; i++) {
                String username = demoUsers.get(random.nextInt(demoUsers.size()));
                UserEntity user = userDetailsService.getUserByUsername(username);
                
                // Get category name by fetching the category directly
                Category category = listing.getCategory();
                String categoryName = category.getName();
                
                // Select appropriate comments based on category
                String[] comments;
                switch (categoryName) {
                    case "Restaurants":
                        comments = restaurantComments[random.nextInt(restaurantComments.length)];
                        break;
                    case "Shopping":
                        comments = shoppingComments[random.nextInt(shoppingComments.length)];
                        break;
                    case "Education":
                        comments = educationComments[random.nextInt(educationComments.length)];
                        break;
                    case "Accommodation":
                        comments = accommodationComments[random.nextInt(accommodationComments.length)];
                        break;
                    case "Health & Beauty":
                        comments = healthComments[random.nextInt(healthComments.length)];
                        break;
                    case "Automotive":
                        comments = automotiveComments[random.nextInt(automotiveComments.length)];
                        break;
                    default:
                        comments = new String[]{"Great service and experience!"};
                }
                
                String comment = comments[random.nextInt(comments.length)];
                int rating = random.nextInt(2) + 4; // 4-5 stars mostly
                
                // 20% chance of having a business response
                String businessResponse = null;
                if (random.nextDouble() < 0.2) {
                    businessResponse = "Thank you for your feedback! We're glad you enjoyed your experience.";
                }
                
                Review review = Review.builder()
                    .user(user)
                    .businessListing(listing)
                    .rating(rating)
                    .comment(comment)
                    .businessResponse(businessResponse)
                    .build();
                
                reviewRepository.save(review);
            }
        }
    }
} 