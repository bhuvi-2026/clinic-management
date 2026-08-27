package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/request-otp")
    public ResponseEntity<Map<String, Object>> requestOtp(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        if (request == null || !request.containsKey("mobileNumber")) {
            response.put("success", false);
            response.put("message", "Mobile number is required");
            return ResponseEntity.badRequest().body(response);
        }

        String mobile = request.get("mobileNumber");
        if (mobile == null || mobile.trim().length() != 10) {
            response.put("success", false);
            response.put("message", "Please enter a valid 10-digit mobile number");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            userService.generateAndSaveOtp(mobile.trim());
            response.put("success", true);
            response.put("message", "OTP sent successfully");
            return ResponseEntity.ok(response);

        } catch (IllegalStateException e) {
            // Catches 60-second cooldown from UserService
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);

        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            System.err.println("[AUTH ERROR] /request-otp failure: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "An unexpected error occurred while sending OTP");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        if (request == null) {
            response.put("success", false);
            response.put("message", "Request body cannot be null");
            return ResponseEntity.badRequest().body(response);
        }

        String mobile = request.get("mobileNumber");
        String otp = request.get("otp");

        if (mobile == null || mobile.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Mobile number is required");
            return ResponseEntity.badRequest().body(response);
        }

        if (otp == null || otp.trim().length() != 6) {
            response.put("success", false);
            response.put("message", "Please enter a valid 6-digit OTP");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            boolean isValid = userService.verifyOtp(mobile.trim(), otp.trim());

            if (!isValid) {
                response.put("success", false);
                response.put("message", "Invalid OTP entered. Please try again.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            response.put("success", true);
            response.put("message", "Verified successfully");
            response.put("userEmail", "patient." + mobile.trim() + "@thyronex.com");
            return ResponseEntity.ok(response);

        } catch (IllegalStateException | IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        } catch (Exception e) {
            System.err.println("[AUTH ERROR] /verify-otp failure: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "An unexpected error occurred during verification");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}