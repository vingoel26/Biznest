package com.biznest.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String username;
    private String email;
    private String password;
    
    // Enhanced profile fields
    private String displayName;
    private String bio;
    private String location;
    private String website;
    private String profilePicture;
    
    // Role management
    private Set<String> roles = new HashSet<>();
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Basic constructor
    public User(String username, String email, String password, String role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = new HashSet<>();
        this.roles.add(role);
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        
        // Set default display name to username if not provided
        this.displayName = username;
        
        // Default profile picture
        this.profilePicture = "/images/defaultUserPicture.png";
    }
    
    // Full constructor with all fields
    public User(String username, String email, String password, Set<String> roles,
                String displayName, String bio, String location, String website, String profilePicture) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles != null ? roles : new HashSet<>();
        this.displayName = displayName != null ? displayName : username;
        this.bio = bio;
        this.location = location;
        this.website = website;
        this.profilePicture = profilePicture != null ? profilePicture : "/images/defaultUserPicture.png";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Check if user has a specific role
    public boolean hasRole(String role) {
        return roles.contains(role);
    }
    
    // Add a role to user
    public void addRole(String role) {
        roles.add(role);
        this.updatedAt = LocalDateTime.now();
    }
    
    // Remove a role from user
    public void removeRole(String role) {
        roles.remove(role);
        this.updatedAt = LocalDateTime.now();
    }
    
    // Update the updatedAt timestamp
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }
}
