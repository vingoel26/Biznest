package com.biznest.backend.controller;

import com.biznest.backend.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
@CrossOrigin
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/forgot")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        if (request.getUsername() == null || request.getEmail() == null) {
            return ResponseEntity.badRequest().body("Username and email are required");
        }
        boolean success = passwordResetService.sendPasswordResetOTP(request.getUsername(), request.getEmail());
        if (success) {
            return ResponseEntity.ok().body("OTP sent to your email");
        } else {
            return ResponseEntity.badRequest().body("Username and email do not match any user");
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request.getUsername() == null || request.getEmail() == null) {
            return ResponseEntity.badRequest().body("Username and email are required");
        }
        boolean success = passwordResetService.verifyOTPAndResetPassword(
            request.getUsername(),
            request.getEmail(),
            request.getOtp(),
            request.getNewPassword()
        );
        if (success) {
            return ResponseEntity.ok().body("Password reset successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid OTP, username, or email");
        }
    }

    public static class ForgotPasswordRequest {
        private String username;
        private String email;
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class ResetPasswordRequest {
        private String username;
        private String email;
        private String otp;
        private String newPassword;
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getOtp() { return otp; }
        public void setOtp(String otp) { this.otp = otp; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
} 