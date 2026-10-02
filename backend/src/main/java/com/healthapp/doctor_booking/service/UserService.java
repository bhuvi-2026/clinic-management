package com.healthapp.doctor_booking.service;

import com.healthapp.doctor_booking.model.User;
import com.healthapp.doctor_booking.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Value("${sms.gateway.enabled:false}")
    private boolean smsGatewayEnabled;

    @Value("${sms.gateway.api.key:YOUR_LOCAL_TEST_KEY}")
    private String smsApiKey;

    // Mock OTP Configuration properties
    @Value("${app.otp.mock-enabled:true}")
    private boolean mockOtpEnabled;

    @Value("${app.otp.default-fallback-otp:123456}")
    private String defaultFallbackOtp;

    @Value("${app.otp.whitelisted-numbers:}")
    private String whitelistedNumbersRaw;

    private final Map<String, String> demoOtpMap = new HashMap<>();
    private final WebClient webClient = WebClient.create();
    private final SecureRandom secureRandom = new SecureRandom();

    @PostConstruct
    public void initDemoOtpMap() {
        if (whitelistedNumbersRaw != null && !whitelistedNumbersRaw.trim().isEmpty()) {
            String[] pairs = whitelistedNumbersRaw.split(",");
            for (String pair : pairs) {
                String[] kv = pair.trim().split(":");
                if (kv.length == 2) {
                    demoOtpMap.put(kv[0].trim(), kv[1].trim());
                }
            }
        }
        System.out.println(">>> [OTP CONFIG] Mock Mode Active: " + mockOtpEnabled 
                + " | Whitelisted Demo Numbers: " + demoOtpMap.keySet());
    }

    public String generateAndSaveOtp(String mobileNumber) {
        String cleanMobile = mobileNumber.trim();

        User user = userRepository.findByMobileNumber(cleanMobile)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setMobileNumber(cleanMobile);
                    return newUser;
                });

        LocalDateTime now = LocalDateTime.now();
        boolean isWhitelisted = demoOtpMap.containsKey(cleanMobile);

        // Cooldown check applies only to live non-whitelisted numbers
        if (!mockOtpEnabled && !isWhitelisted && user.getLastOtpRequestedAt() != null &&
                user.getLastOtpRequestedAt().plusSeconds(60).isAfter(now)) {
            long secondsLeft = 60 - java.time.Duration.between(user.getLastOtpRequestedAt(), now).getSeconds();
            throw new IllegalStateException("Please wait " + Math.max(secondsLeft, 1) + " seconds before requesting a new OTP.");
        }

        // Determine OTP: Whitelisted -> Static Fallback -> Cryptographic Random
        String otp;
        if (mockOtpEnabled) {
            otp = demoOtpMap.getOrDefault(cleanMobile, defaultFallbackOtp);
        } else {
            otp = isWhitelisted ? demoOtpMap.get(cleanMobile) : String.format("%06d", secureRandom.nextInt(1000000));
        }

        user.setCurrentOtp(otp);
        user.setOtpExpiry(now.plusMinutes(15)); // Extended window for demo ease
        user.setLastOtpRequestedAt(now);
        user.setOtpAttemptCount(0);

        userRepository.save(user);

        // Dispatch via Cellular Gateway only when mock mode is explicitly false
        if (smsGatewayEnabled && !mockOtpEnabled && !isWhitelisted) {
            try {
                String smsUrl = "https://www.fast2sms.com/dev/bulkV2?authorization=" + smsApiKey
                        + "&variables_values=" + otp + "&route=otp&numbers=" + cleanMobile;

                this.webClient.get()
                        .uri(smsUrl)
                        .retrieve()
                        .toBodilessEntity()
                        .subscribe(
                                res -> System.out.println("[SMS GATEWAY] OTP delivered to: " + cleanMobile),
                                err -> System.err.println("[SMS GATEWAY ERROR] " + err.getMessage())
                        );
            } catch (Exception e) {
                System.err.println("[SMS WARNING] External SMS service skipped: " + e.getMessage());
            }
        } else {
            System.out.println("=================================================");
            System.out.println(">>> [DEMO OTP GENERATED] Mobile: " + cleanMobile + " | Static OTP: " + otp);
            System.out.println("=================================================");
        }

        return otp;
    }

    public boolean verifyOtp(String mobileNumber, String typedOtp) {
        String cleanMobile = mobileNumber.trim();
        String cleanOtp = typedOtp.trim();

        User user = userRepository.findByMobileNumber(cleanMobile)
                .orElseThrow(() -> new IllegalArgumentException("User not found for mobile: " + cleanMobile));

        LocalDateTime now = LocalDateTime.now();

        // 1. Direct evaluation for Whitelisted / Mock Numbers
        if (mockOtpEnabled || demoOtpMap.containsKey(cleanMobile)) {
            String expectedOtp = demoOtpMap.getOrDefault(cleanMobile, defaultFallbackOtp);
            if (cleanOtp.equals(expectedOtp) || cleanOtp.equals(user.getCurrentOtp())) {
                user.setCurrentOtp(null);
                user.setOtpExpiry(null);
                user.setOtpAttemptCount(0);
                userRepository.save(user);
                return true;
            }
        }

        // 2. Standard Production OTP checks
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