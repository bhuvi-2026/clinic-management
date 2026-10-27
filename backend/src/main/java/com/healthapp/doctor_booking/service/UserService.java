package com.healthapp.doctor_booking.service;

import com.healthapp.doctor_booking.model.User;
import com.healthapp.doctor_booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WhatsAppService whatsAppService;

    private final SecureRandom secureRandom = new SecureRandom();

    public String generateAndSaveOtp(String mobileNumber) {
        // 1. Sanitize the incoming number
        String sanitized = mobileNumber.replaceAll("[^0-9]", "");
        if (sanitized.startsWith("91") && sanitized.length() == 12) {
            sanitized = sanitized.substring(2);
        }

        // 2. Make it explicitly final so lambdas can safely capture it
        final String cleanMobile = sanitized;

        // 3. Query repository safely inside lambda
        User user = userRepository.findByMobileNumber(cleanMobile)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setMobileNumber(cleanMobile);
                    return newUser;
                });

        LocalDateTime now = LocalDateTime.now();

        // 60-second rate-limit cooldown check
        if (user.getLastOtpRequestedAt() != null &&
            user.getLastOtpRequestedAt().plusSeconds(60).isAfter(now)) {
            long secondsLeft = 60 - java.time.Duration.between(user.getLastOtpRequestedAt(), now).getSeconds();
            throw new IllegalStateException("Please wait " + Math.max(secondsLeft, 1) + " seconds before requesting a new OTP.");
        }

        // Generate 6-digit cryptographic OTP
        String otp = String.format("%06d", secureRandom.nextInt(1000000));

        user.setCurrentOtp(otp);
        user.setOtpExpiry(now.plusMinutes(5));
        user.setLastOtpRequestedAt(now);
        user.setOtpAttemptCount(0);

        userRepository.save(user);

        // Debug logging
        System.out.println("=================================================");
        System.out.println(">>> [WHATSAPP OTP TRIGGERED] Mobile: " + cleanMobile + " | OTP: " + otp);
        System.out.println("=================================================");

        // Dispatch OTP directly to user's WhatsApp
        whatsAppService.sendOtpWhatsApp(cleanMobile, otp);

        return otp;
    }

    public boolean verifyOtp(String mobileNumber, String typedOtp) {
        String sanitized = mobileNumber.replaceAll("[^0-9]", "");
        if (sanitized.startsWith("91") && sanitized.length() == 12) {
            sanitized = sanitized.substring(2);
        }
        final String cleanMobile = sanitized;
        final String cleanOtp = typedOtp != null ? typedOtp.trim() : "";

        User user = userRepository.findByMobileNumber(cleanMobile)
                .orElseThrow(() -> new IllegalArgumentException("User not found for mobile: " + cleanMobile));

        LocalDateTime now = LocalDateTime.now();

        if (user.getOtpAttemptCount() != null && user.getOtpAttemptCount() >= 5) {
            user.setCurrentOtp(null);
            userRepository.save(user);
            throw new IllegalStateException("Too many incorrect attempts. Please request a new OTP.");
        }

        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(now)) {
            user.setCurrentOtp(null);
            userRepository.save(user);
            throw new IllegalStateException("OTP has expired. Please request a new OTP.");
        }

        if (cleanOtp.equals(user.getCurrentOtp())) {
            user.setCurrentOtp(null);
            user.setOtpExpiry(null);
            user.setOtpAttemptCount(0);
            userRepository.save(user);
            return true;
        } else {
            user.setOtpAttemptCount((user.getOtpAttemptCount() != null ? user.getOtpAttemptCount() : 0) + 1);
            userRepository.save(user);
            return false;
        }
    }
}