package com.biznest.backend.service;

import com.biznest.backend.model.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    // --- In-Memory User Store (Moved from AuthController) ---
    private static final Map<String, User> userStore = new ConcurrentHashMap<>();
    
    // Pre-add a test user with a HASHED password
    static {
        // Note: In a real app, you wouldn't hardcode this. Hash is for "password123"
        String encodedPassword = new BCryptPasswordEncoder().encode("password123");
        
        // Create admin user with enhanced profile
        User adminUser = new User("BIZNEST.CREATOR", "BIZNEST.CREATOR@admin.com", encodedPassword, "ROLE_ADMIN");
        adminUser.setDisplayName("Biznest Admin");
        adminUser.setBio("System administrator for Biznest platform");
        adminUser.setLocation("Biznest HQ");
        adminUser.setWebsite("https://biznest.com");
        
        userStore.put(adminUser.getUsername(), adminUser);
    }

    // Method to add users (used by AuthController)
    public void addUser(User user) {
        // Basic check to prevent overwriting existing user
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
        // Now with proper authorities based on user roles
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }
    
    // --- Enhanced User Management Methods ---
    
    // Get user by username (returns our User model, not UserDetails)
    public User getUserByUsername(String username) {
        return userStore.get(username);
    }
    
    // Get all users (admin function)
    public List<User> getAllUsers() {
        return new ArrayList<>(userStore.values());
    }
    
    // Update user profile
    public User updateUserProfile(String username, Map<String, Object> updates) {
        User user = userStore.get(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        
        // Apply updates to user profile
        if (updates.containsKey("displayName")) {
            user.setDisplayName((String) updates.get("displayName"));
        }
        if (updates.containsKey("bio")) {
            user.setBio((String) updates.get("bio"));
        }
        if (updates.containsKey("location")) {
            user.setLocation((String) updates.get("location"));
        }
        if (updates.containsKey("website")) {
            user.setWebsite((String) updates.get("website"));
        }
        if (updates.containsKey("profilePicture")) {
            user.setProfilePicture((String) updates.get("profilePicture"));
        }
        if (updates.containsKey("email")) {
            user.setEmail((String) updates.get("email"));
        }
        
        // Update timestamp
        user.setUpdatedAt(LocalDateTime.now());
        
        // Save updated user
        userStore.put(username, user);
        
        return user;
    }
    
    // Update user roles (admin function)
    public User updateUserRoles(String username, Set<String> roles) {
        User user = userStore.get(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        
        user.setRoles(roles);
        user.setUpdatedAt(LocalDateTime.now());
        userStore.put(username, user);
        
        return user;
    }
    
    // Delete user (admin function)
    public boolean deleteUser(String username) {
        User user = userStore.get(username);
        
        // Prevent deletion of admin users
        if (user != null && user.hasRole("ROLE_ADMIN")) {
            return false;
        }
        
        return userStore.remove(username) != null;
    }
    
    // Update password
    public boolean updatePassword(String username, String currentPassword, String newPassword) {
        User user = userStore.get(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        
        // Check if current password matches
        if (!new BCryptPasswordEncoder().matches(currentPassword, user.getPassword())) {
            return false;
        }
        
        // Update password with new hashed password
        String encodedPassword = new BCryptPasswordEncoder().encode(newPassword);
        user.setPassword(encodedPassword);
        user.setUpdatedAt(LocalDateTime.now());
        userStore.put(username, user);
        
        return true;
    }
}
