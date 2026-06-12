package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/request-otp")
    public ResponseEntity<Map<String, String>> requestOtp(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobileNumber");
        
        if (mobile == null || mobile.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mobile number is required"));
        }

        String otp = userService.generateAndSaveOtp(mobile);
        
        // Print to console so you can see the OTP without a real SMS gateway
        System.out.println(">>> [SMS GATEWAY] Sending OTP " + otp + " to " + mobile);
        
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobileNumber");
        String otp = request.get("otp");
        
        boolean isValid = userService.verifyOtp(mobile, otp);
        
        if (!isValid) {
            // FIXED: Returns 401 Unauthorized status code along with the failure payload
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "success", false, 
                "message", "Invalid OTP"
            ));
        }
        
        // FIXED: Returns 200 OK for successful verification
        return ResponseEntity.ok(Map.of(
            "success", true, 
            "message", "Verified"
        ));
    }
}