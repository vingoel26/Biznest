package com.biznest.backend.controller;

import com.biznest.backend.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin
public class ContactController {
    @Autowired
    private MailService mailService;

    @PostMapping
    public String sendContact(@RequestBody ContactRequest request) {
        mailService.sendContactMail(request.getEmail(), request.getFullName(), request.getMessage(), request.getType());
        return "Message sent";
    }

    public static class ContactRequest {
        private String fullName;
        private String email;
        private String message;
        private String type;
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
    }
} 