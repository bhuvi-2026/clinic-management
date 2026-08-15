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

    private final SecureRandom secureRandom = new SecureRandom();

    public String generateAndSaveOtp(String mobileNumber) {
        User user = userRepository.findByMobileNumber(mobileNumber)
                                  .orElse(new User());
        user.setMobileNumber(mobileNumber);

        LocalDateTime now = LocalDateTime.now();

        // Rate limit: 60-second cooldown
        if (user.getLastOtpRequestedAt() != null && 
            user.getLastOtpRequestedAt().plusSeconds(60).isAfter(now)) {
            long secondsLeft = java.time.Duration.between(user.getLastOtpRequestedAt(), now).getSeconds();
            throw new IllegalStateException("Please wait " + (60 - secondsLeft) + " seconds before requesting a new OTP.");
        }

        // Generate 6-digit secure random OTP
        String otp = String.format("%06d", secureRandom.nextInt(1000000));
        
        user.setCurrentOtp(otp);
        user.setOtpExpiry(now.plusMinutes(5)); // 5 minutes validity
        user.setLastOtpRequestedAt(now);
        user.setOtpAttemptCount(0); // reset attempts on new request
        
        userRepository.save(user);
        return otp;
    }

    public boolean verifyOtp(String mobileNumber, String typedOtp) {
        User user = userRepository.findByMobileNumber(mobileNumber)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        LocalDateTime now = LocalDateTime.now();

        // Check attempt limit
        if (user.getOtpAttemptCount() != null && user.getOtpAttemptCount() >= 5) {
            user.setCurrentOtp(null); // Invalidate OTP
            userRepository.save(user);
            throw new IllegalStateException("Too many incorrect attempts. Please request a new OTP.");
        }

        // Check expiration
        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(now)) {
            user.setCurrentOtp(null); // Invalidate OTP
            userRepository.save(user);
            throw new IllegalStateException("OTP has expired. Please request a new OTP.");
        }

        // Check OTP match
        if (typedOtp != null && typedOtp.equals(user.getCurrentOtp())) {
            // Success: clear OTP state (single-use OTP)
            user.setCurrentOtp(null);
            user.setOtpExpiry(null);
            user.setOtpAttemptCount(0);
            userRepository.save(user);
            return true;
        } else {
            // Failed attempt
            user.setOtpAttemptCount(user.getOtpAttemptCount() + 1);
            userRepository.save(user);
            return false;
        }
    }
}
