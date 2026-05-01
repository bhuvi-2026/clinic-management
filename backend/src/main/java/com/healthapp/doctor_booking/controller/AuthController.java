package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/request-otp")
    public Map<String, String> requestOtp(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobileNumber");
        String otp = userService.generateAndSaveOtp(mobile);
        
        // Print to console so you can see the OTP without a real SMS gateway
        System.out.println(">>> [SMS GATEWAY] Sending OTP " + otp + " to " + mobile);
        
        return Map.of("message", "OTP sent successfully");
    }

    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobileNumber");
        String otp = request.get("otp");
        
        boolean isValid = userService.verifyOtp(mobile, otp);
        return Map.of("success", isValid, "message", isValid ? "Verified" : "Invalid OTP");
    }
}