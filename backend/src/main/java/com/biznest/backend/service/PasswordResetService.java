package com.biznest.backend.service;

import com.biznest.backend.model.UserEntity;
import com.biznest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class PasswordResetService {

    @Autowired
    private MailService mailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // In-memory storage for OTPs (in production, use Redis or database)
    private Map<String, OTPData> otpStorage = new HashMap<>();

    public boolean sendPasswordResetOTP(String email) {
        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            return false; // User not found
        }

        String otp = generateOTP();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(10);
        
        otpStorage.put(email, new OTPData(otp, expiryTime));
        
        mailService.sendPasswordResetOTP(email, otp);
        return true;
    }

    public boolean verifyOTPAndResetPassword(String email, String otp, String newPassword) {
        OTPData otpData = otpStorage.get(email);
        if (otpData == null) {
            return false; // No OTP found
        }

        if (LocalDateTime.now().isAfter(otpData.expiryTime)) {
            otpStorage.remove(email);
            return false; // OTP expired
        }

        if (!otpData.otp.equals(otp)) {
            return false; // Invalid OTP
        }

        // Update password
        UserEntity user = userRepository.findByEmail(email);
        if (user != null) {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        }

        // Remove OTP after successful use
        otpStorage.remove(email);
        return true;
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }

    private static class OTPData {
        String otp;
        LocalDateTime expiryTime;

        OTPData(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
} 