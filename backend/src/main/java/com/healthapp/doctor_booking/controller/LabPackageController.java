package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.model.LabPackage;
import com.healthapp.doctor_booking.service.EmailService;
import com.healthapp.doctor_booking.service.LabService;
import com.healthapp.doctor_booking.model.LabBookingRequest; // Import the new class

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lab-packages")
@CrossOrigin(origins = "http://localhost:4200") // Allows Angular to connect
public class LabPackageController {

    private final LabService labService;
    private final EmailService emailService;

    public LabPackageController(LabService labService, EmailService emailService) {
        this.labService = labService;
        this.emailService= emailService;
    }

    @GetMapping
    public List<LabPackage> getPackages() {
        return labService.getAllPackages();
    }


@PostMapping("/confirm-booking")
public ResponseEntity<?> confirmLabBooking(
        @RequestBody LabBookingRequest bookingRequest,
        @RequestHeader(value = "Clinic-Owner-Email") String ownerEmail) {
    
    // This now works because LabBookingRequest is a resolved type
    emailService.sendLabBookingNotification(ownerEmail, bookingRequest);
    return ResponseEntity.ok().body("{\"message\": \"Notification sent\"}");
}

}