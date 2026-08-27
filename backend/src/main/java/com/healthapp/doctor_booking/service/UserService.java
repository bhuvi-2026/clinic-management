package com.healthapp.doctor_booking.service;

import com.healthapp.doctor_booking.model.User;
import com.healthapp.doctor_booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Value("${sms.gateway.enabled:false}")
    private boolean smsGatewayEnabled;

    @Value("${sms.gateway.api.key:YOUR_LOCAL_TEST_KEY}")
    private String smsApiKey;

    private final WebClient webClient = WebClient.create();
    private final SecureRandom secureRandom = new SecureRandom();

    public String generateAndSaveOtp(String mobileNumber) {
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setMobileNumber(mobileNumber);
                    return newUser;
                });

        LocalDateTime now = LocalDateTime.now();

        // 60-second rate-limit cooldown check
        if (user.getLastOtpRequestedAt() != null && 
            user.getLastOtpRequestedAt().plusSeconds(60).isAfter(now)) {
            long secondsLeft = 60 - java.time.Duration.between(user.getLastOtpRequestedAt(), now).getSeconds();
            throw new IllegalStateException("Please wait " + Math.max(secondsLeft, 1) + " seconds before requesting a new OTP.");
        }

        String otp = String.format("%06d", secureRandom.nextInt(1000000));

        user.setCurrentOtp(otp);
        user.setOtpExpiry(now.plusMinutes(5));
        user.setLastOtpRequestedAt(now);
        user.setOtpAttemptCount(0);

        userRepository.save(user);

        // Optional Production Cellular SMS Gateway
        if (smsGatewayEnabled) {
            try {
                String smsUrl = "https://www.fast2sms.com/dev/bulkV2?authorization=" + smsApiKey 
                        + "&variables_values=" + otp + "&route=otp&numbers=" + mobileNumber;

                this.webClient.get()
                        .uri(smsUrl)
                        .retrieve()
                        .toBodilessEntity()
                        .subscribe(
                            res -> System.out.println("[SMS GATEWAY] OTP delivered to: " + mobileNumber),
                            err -> System.err.println("[SMS GATEWAY ERROR] " + err.getMessage())
                        );
            } catch (Exception e) {
                System.err.println("[SMS WARNING] External SMS service skipped: " + e.getMessage());
            }
        } else {
            // Local Terminal Simulation
            System.out.println("=================================================");
            System.out.println(">>> [LOCAL OTP SIMULATOR] Mobile: " + mobileNumber + " | OTP: " + otp);
            System.out.println("=================================================");
        }

        return otp;
    }

    public boolean verifyOtp(String mobileNumber, String typedOtp) {
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new IllegalArgumentException("User not found for mobile: " + mobileNumber));

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

        if (typedOtp != null && typedOtp.trim().equals(user.getCurrentOtp())) {
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