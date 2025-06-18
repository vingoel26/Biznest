package com.biznest.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import com.biznest.backend.service.UserDetailsServiceImpl;
import com.biznest.backend.model.UserEntity;
import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public org.springframework.boot.CommandLineRunner createDefaultAdmin(UserDetailsServiceImpl userDetailsService) {
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
		};
	}

}
