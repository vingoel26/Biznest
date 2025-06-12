package com.biznest.backend.service;

import com.biznest.backend.model.User; // Our User model
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Needed for static block init
import org.springframework.stereotype.Service;

import java.util.ArrayList; // For empty authorities list
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    // --- In-Memory User Store (Moved from AuthController) ---
    private static final Map<String, User> userStore = new ConcurrentHashMap<>();
    // Pre-add a test user with a HASHED password
    static {
        // Note: In a real app, you wouldn't hardcode this. Hash is for "password123"
        String encodedPassword = new BCryptPasswordEncoder().encode("password123");
        userStore.put("BIZNEST.CREATOR", new User("BIZNEST.CREATOR", "BIZNEST.CREATOR@admin.com", encodedPassword,"ROLE_ADMIN"));
    }
    // ----------------------------------------------------------

    // Method to add users (used by AuthController)
    public void addUser(User user) {
         // Basic check to prevent overwriting existing user (could enhance)
         if (userStore.containsKey(user.getUsername())) {
             throw new IllegalArgumentException("Username already exists: " + user.getUsername());
         }
        userStore.put(user.getUsername(), user);
    }

    // Method to check if user exists (used by AuthController)
    public boolean userExists(String username) {
        return userStore.containsKey(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userStore.get(username);
        if (user == null) {
            throw new UsernameNotFoundException("User Not Found with username: " + username);
        }

        // Convert our User model to Spring Security UserDetails
        // Using an empty list for authorities for now
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(), // Password here MUST be the stored hash
                new ArrayList<>() // Empty authorities list
        );
    }
} 