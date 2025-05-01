package com.biznest.backend.controller;

import com.biznest.backend.dto.LoginRequest;
import com.biznest.backend.dto.MessageResponse;
import com.biznest.backend.dto.SignUpRequest;
import com.biznest.backend.dto.JwtResponse;
import com.biznest.backend.model.User;
import com.biznest.backend.security.jwt.JwtUtils;
import com.biznest.backend.service.UserDetailsServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequest signUpRequest) {
        // Basic validation
        if (signUpRequest.getUsername() == null || signUpRequest.getUsername().isBlank()) {
            return new ResponseEntity<>(new MessageResponse("Error: Username cannot be blank!"), HttpStatus.BAD_REQUEST);
        }
        if (signUpRequest.getPassword() == null || signUpRequest.getPassword().length() < 8) {
             return new ResponseEntity<>(new MessageResponse("Error: Password must be at least 8 characters!"), HttpStatus.BAD_REQUEST);
        }
        if (userDetailsService.userExists(signUpRequest.getUsername())) {
            return new ResponseEntity<>(new MessageResponse("Error: Username is already taken!"), HttpStatus.BAD_REQUEST);
        }

        String encodedPassword = passwordEncoder.encode(signUpRequest.getPassword());
        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encodedPassword
        );

        userDetailsService.addUser(user);

        System.out.println("User registered: " + user.getUsername());
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        UserDetails userDetails;
        try {
             userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(new MessageResponse("Error: Invalid username or password."), HttpStatus.UNAUTHORIZED);
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), userDetails.getPassword())) {
            return new ResponseEntity<>(new MessageResponse("Error: Invalid username or password."), HttpStatus.UNAUTHORIZED);
        }

        // If authentication is successful, generate JWT
        String jwt = jwtUtils.generateJwtToken(userDetails.getUsername());

        System.out.println("User authenticated: " + userDetails.getUsername());
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername()));
    }
} 