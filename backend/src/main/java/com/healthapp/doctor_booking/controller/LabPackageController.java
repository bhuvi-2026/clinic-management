package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.model.LabPackage;
import com.healthapp.doctor_booking.service.EmailService;
import com.healthapp.doctor_booking.service.LabService;
import com.healthapp.doctor_booking.service.WhatsAppService;
import com.healthapp.doctor_booking.model.LabBookingRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab-packages")
@CrossOrigin(origins = "http://localhost:4200")
public class LabPackageController {

    private final LabService labService;
    private final EmailService emailService;
    private final WhatsAppService whatsAppService;

    public LabPackageController(LabService labService, EmailService emailService, WhatsAppService whatsAppService) {
        this.labService = labService;
        this.emailService = emailService;
        this.whatsAppService = whatsAppService;
    }

    @GetMapping
    public List<LabPackage> getPackages() {
        return labService.getAllPackages();
    }

    @PostMapping("/confirm-booking")
    public ResponseEntity<?> confirmLabBooking(
            @RequestBody LabBookingRequest bookingRequest,
            @RequestHeader(value = "Clinic-Owner-Email") String ownerEmail) {
        
        emailService.sendLabBookingNotification(ownerEmail, bookingRequest);
        whatsAppService.sendBookingWhatsApp(ownerEmail, bookingRequest);

        return ResponseEntity.ok().body("{\"message\": \"Notification sent\"}");
    }
}