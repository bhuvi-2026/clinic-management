package com.healthapp.doctor_booking.service;

import com.healthapp.doctor_booking.model.User;
import com.healthapp.doctor_booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String generateAndSaveOtp(String mobileNumber) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        User user = userRepository.findByMobileNumber(mobileNumber)
                                  .orElse(new User());
        user.setMobileNumber(mobileNumber);
        user.setCurrentOtp(otp);
        userRepository.save(user);
        
        return otp;
    }

    public boolean verifyOtp(String mobileNumber, String typedOtp) {
        return userRepository.findByMobileNumber(mobileNumber)
                .map(user -> {
                    if (typedOtp.equals(user.getCurrentOtp())) {
                        user.setCurrentOtp(null); // Success: clear OTP
                        userRepository.save(user);
                        return true;
                    }
                    return false;
                }).orElse(false);
    }
}