package com.tengelyhatalmak.languaforge.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendActivationEmail(String toEmail, String username, String activationToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("languaforgenoreply@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Activate your LanguageForge account!");
        message.setText("Dear " + username + ",\n\n" +
                "Thank you for registering at LanguageForge! Please activate your account by clicking the link below:\n" +
                "http://localhost:8080/auth/activate?token=" + activationToken + "\n\n" +
                "Best regards,\n" +
                "The LanguageForge Team");

        mailSender.send(message);
    }
}
