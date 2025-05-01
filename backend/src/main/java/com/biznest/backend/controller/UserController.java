package com.biznest.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal; // Import Principal

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) { // Inject Principal
        // Principal contains the authenticated user's name (from JWT subject)
        if (principal == null) {
             // Should not happen if security is configured correctly, but good practice
            return ResponseEntity.status(401).body("No authenticated user found.");
        }
        String username = principal.getName();
        
        // In a real app, you might load more user details from DB based on username
        return ResponseEntity.ok("Hello, authenticated user: " + username + "! This is protected data.");
    }

     // Alternative way using SecurityContextHolder
     @GetMapping("/me2")
     public ResponseEntity<?> getCurrentUserAlternative() {
         Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
         if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
             return ResponseEntity.status(401).body("No authenticated user found.");
         }
         String username;
         Object principal = authentication.getPrincipal();
         if (principal instanceof UserDetails) {
             username = ((UserDetails)principal).getUsername();
         } else {
             username = principal.toString();
         }
         return ResponseEntity.ok("Hello again, authenticated user: " + username + "! From alternative method.");
     }
} 