package com.biznest.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import com.biznest.backend.service.UserDetailsServiceImpl;
import com.biznest.backend.model.UserEntity;
import java.util.HashSet;
import java.util.Set;
import com.biznest.backend.model.BusinessListing;
import com.biznest.backend.repository.BusinessListingRepository;
import java.util.Arrays;
import com.biznest.backend.model.Category;
import com.biznest.backend.repository.CategoryRepository;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public org.springframework.boot.CommandLineRunner createDefaultAdmin(UserDetailsServiceImpl userDetailsService, BusinessListingRepository businessListingRepository, CategoryRepository categoryRepository) {
		return args -> {
			String adminUsername = "BIZNEST.CREATOR";
			if (!userDetailsService.userExists(adminUsername)) {
				Set<String> roles = new HashSet<>();
				roles.add("ROLE_ADMIN");
				UserEntity admin = new UserEntity(
						adminUsername,
						"Biznest.Creator@admin.com",
						"password123", // password will be encoded in service
						roles,
						"Biznest Creator", // displayName
						null,
						null,
						null,
						"/images/defaultUserPicture.png"
				);
				userDetailsService.addUser(admin);
			}
			// Fetch the managed admin entity for use as owner
			UserEntity admin = userDetailsService.getUserByUsername(adminUsername);

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
						.location("Downtown")
						.status("Approved")
						.description("Best Kebabs in town!")
						.address("123 Food Street, Downtown")
						.phone("+1 (555) 123-4567")
						.businessHours("9:00 AM - 10:00 PM")
						.rating(4.8)
						.imageUrl("/images/restaurant-image.webp")
						.build(),
					BusinessListing.builder()
						.name("Pheonix Palassio")
						.category(shopping)
						.owner(admin)
						.location("Midtown")
						.status("Approved")
						.description("Your one-stop shop for everything!")
						.address("456 Mall Avenue, Midtown")
						.phone("+1 (555) 987-6543")
						.businessHours("10:00 AM - 9:00 PM")
						.rating(4.5)
						.imageUrl("/images/shopping.webp")
						.build(),
					BusinessListing.builder()
						.name("IIIT Lucknow")
						.category(education)
						.owner(admin)
						.location("Eastside")
						.status("Approved")
						.description("The world is at IIIT Lucknow, where are you?")
						.address("789 University Blvd, Eastside")
						.phone("+1 (555) 456-7890")
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
						.description("Best hostel in the whole town!")
						.address("321 Dorm Lane, Campus Area")
						.phone("+1 (555) 234-5678")
						.businessHours("24/7")
						.rating(4.2)
						.imageUrl("/images/homeService.webp")
						.build(),
					BusinessListing.builder()
						.name("Luxury Spa & Wellness")
						.category(health)
						.owner(admin)
						.location("Uptown")
						.status("Approved")
						.description("Relax and rejuvenate with our premium services")
						.address("567 Wellness Way, Uptown")
						.phone("+1 (555) 789-0123")
						.businessHours("9:00 AM - 8:00 PM")
						.rating(4.7)
						.imageUrl("/images/Beauty.webp")
						.build(),
					BusinessListing.builder()
						.name("Premium Auto Repair")
						.category(automotive)
						.owner(admin)
						.location("Industrial Zone")
						.status("Pending")
						.description("Expert mechanics for all your vehicle needs")
						.address("890 Mechanic Street, Industrial Zone")
						.phone("+1 (555) 345-6789")
						.businessHours("8:00 AM - 6:00 PM")
						.rating(4.6)
						.imageUrl("/images/automotive.webp")
						.build()
				));
			}

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
		};
	}

}
