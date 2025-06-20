package com.biznest.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendContactMail(String from, String name, String message, String type) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        
        String subject;
        String recipient;

        if ("business".equalsIgnoreCase(type)) {
            subject = "New Business Listing Inquiry from " + name;
            recipient = "contact.biznest@gmail.com"; // Email for business inquiries
        } else {
            subject = "New General Inquiry from " + name;
            recipient = "contact.biznest@gmail.com"; // Email for general inquiries
        }

        mailMessage.setTo(recipient);
        mailMessage.setSubject(subject);
        mailMessage.setText("From: " + name + " <" + from + ">\n\n" + message);
        mailSender.send(mailMessage);
    }
} 