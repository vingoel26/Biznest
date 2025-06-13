package com.biznest.backend.controller;

import com.biznest.backend.dto.MessageResponse;
import com.biznest.backend.model.User;
import com.biznest.backend.model.UserEntity;
import com.biznest.backend.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserDetailsServiceImpl userService;

    // Get current user profile
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(new MessageResponse("No authenticated user found."));
        }
        
        String username = principal.getName();
        UserEntity user = userService.getUserByUsername(username);
        
        if (user == null) {
            return ResponseEntity.status(404).body(new MessageResponse("User not found."));
        }
        
        // Create a safe user object without password
        Map<String, Object> safeUser = new HashMap<>();
        safeUser.put("username", user.getUsername());
        safeUser.put("email", user.getEmail());
        safeUser.put("displayName", user.getDisplayName());
        safeUser.put("bio", user.getBio());
        safeUser.put("location", user.getLocation());
        safeUser.put("website", user.getWebsite());
        safeUser.put("profilePicture", user.getProfilePicture());
        safeUser.put("roles", user.getRoles());
        safeUser.put("createdAt", user.getCreatedAt());
        safeUser.put("updatedAt", user.getUpdatedAt());
        
        return ResponseEntity.ok(safeUser);
    }

    // Update current user profile
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUserProfile(Principal principal, @RequestBody Map<String, Object> updates) {
        if (principal == null) {
            return ResponseEntity.status(401).body(new MessageResponse("No authenticated user found."));
        }
        
        String username = principal.getName();
        
        try {
            UserEntity updatedUser = userService.updateUserProfile(username, updates);
            
            // Create a safe user object without password
            Map<String, Object> safeUser = new HashMap<>();
            safeUser.put("username", updatedUser.getUsername());
            safeUser.put("email", updatedUser.getEmail());
            safeUser.put("displayName", updatedUser.getDisplayName());
            safeUser.put("bio", updatedUser.getBio());
            safeUser.put("location", updatedUser.getLocation());
            safeUser.put("website", updatedUser.getWebsite());
            safeUser.put("profilePicture", updatedUser.getProfilePicture());
            safeUser.put("roles", updatedUser.getRoles());
            safeUser.put("createdAt", updatedUser.getCreatedAt());
            safeUser.put("updatedAt", updatedUser.getUpdatedAt());
            
            return ResponseEntity.ok(safeUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error updating profile: " + e.getMessage()));
        }
    }

    // Update password
    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(Principal principal, @RequestBody Map<String, String> passwordData) {
        if (principal == null) {
            return ResponseEntity.status(401).body(new MessageResponse("No authenticated user found."));
        }
        
        String username = principal.getName();
        String currentPassword = passwordData.get("currentPassword");
        String newPassword = passwordData.get("newPassword");
        
        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Current password and new password are required."));
        }
        
        try {
            boolean updated = userService.updatePassword(username, currentPassword, newPassword);
            if (updated) {
                return ResponseEntity.ok(new MessageResponse("Password updated successfully."));
            } else {
                return ResponseEntity.status(400).body(new MessageResponse("Current password is incorrect."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponse("Error updating password: " + e.getMessage()));
        }
    }

    // --- Admin-only functions ---
    
    // Get all users (admin only)
    @GetMapping("/all")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        List<Map<String, Object>> safeUsers = userService.getAllUsers().stream()
                .map(user -> {
                    Map<String, Object> safeUser = new HashMap<>();
                    safeUser.put("username", user.getUsername());
                    safeUser.put("email", user.getEmail());
                    safeUser.put("displayName", user.getDisplayName());
                    safeUser.put("bio", user.getBio());
                    safeUser.put("location", user.getLocation());
                    safeUser.put("website", user.getWebsite());
                    safeUser.put("profilePicture", user.getProfilePicture());
                    safeUser.put("roles", user.getRoles());
                    safeUser.put("createdAt", user.getCreatedAt());
                    safeUser.put("updatedAt", user.getUpdatedAt());
                    return safeUser;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(safeUsers);
    }
    
    // Get specific user by username (admin only)
    @GetMapping("/{username}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        UserEntity user = userService.getUserByUsername(username);
        
        if (user == null) {
            return ResponseEntity.status(404).body(new MessageResponse("User not found."));
        }
        
        // Create a safe user object without password
        Map<String, Object> safeUser = new HashMap<>();
        safeUser.put("username", user.getUsername());
        safeUser.put("email", user.getEmail());
        safeUser.put("displayName", user.getDisplayName());
        safeUser.put("bio", user.getBio());
        safeUser.put("location", user.getLocation());
        safeUser.put("website", user.getWebsite());
        safeUser.put("profilePicture", user.getProfilePicture());
        safeUser.put("roles", user.getRoles());
        safeUser.put("createdAt", user.getCreatedAt());
        safeUser.put("updatedAt", user.getUpdatedAt());
        
        return ResponseEntity.ok(safeUser);
    }
    
    // Update user roles (admin only)
    @PutMapping("/{username}/roles")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateUserRoles(@PathVariable String username, @RequestBody Set<String> roles) {
        try {
            UserEntity updatedUser = userService.updateUserRoles(username, roles);
            return ResponseEntity.ok(new MessageResponse("Roles updated successfully for user: " + username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error updating roles: " + e.getMessage()));
        }
    }
    
    // Delete user (admin only)
    @DeleteMapping("/{username}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        boolean deleted = userService.deleteUser(username);
        
        if (deleted) {
            return ResponseEntity.ok(new MessageResponse("User deleted successfully: " + username));
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Cannot delete user. User may be an admin or not found."));
        }
    }
}
