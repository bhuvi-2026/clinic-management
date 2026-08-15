package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.model.LabBooking;
import com.healthapp.doctor_booking.model.LabBookingRequest;
import com.healthapp.doctor_booking.model.LabPackage;
import com.healthapp.doctor_booking.service.EmailService;
import com.healthapp.doctor_booking.service.LabService;
import com.healthapp.doctor_booking.service.WhatsAppService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

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

    @PostMapping
    public ResponseEntity<LabPackage> createPackage(@RequestBody LabPackage labPackage) {
        LabPackage savedPackage = labService.savePackage(labPackage);
        return ResponseEntity.ok(savedPackage);
    }

    @PostMapping("/confirm-booking")
    public ResponseEntity<?> confirmLabBooking(
            @RequestBody LabBookingRequest bookingRequest,
            @RequestHeader(value = "Clinic-Owner-Email", required = false) String ownerEmail) {
        
        if (bookingRequest.getPatientPhone() == null || bookingRequest.getPatientPhone().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Patient phone is required\"}");
        }
        if (bookingRequest.getPackageName() == null || bookingRequest.getPackageName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Package name is required\"}");
        }

        // 1. Persist the booking reliably in the database
        LabBooking savedBooking = labService.bookTest(bookingRequest);

        // 2. Trigger notifications asynchronously so failures do not abort/corrupt the booking response
        CompletableFuture.runAsync(() -> {
            try {
                emailService.sendLabBookingNotificationToOwner(ownerEmail, savedBooking);
                emailService.sendLabBookingConfirmationToUser(savedBooking);
            } catch (Exception e) {
                System.err.println("Async Email Notification failure: " + e.getMessage());
            }
            try {
                whatsAppService.sendBookingWhatsApp(ownerEmail, savedBooking);
            } catch (Exception e) {
                System.err.println("Async WhatsApp Notification failure: " + e.getMessage());
            }
        });

        // 3. Return clear success response containing saved booking details
        return ResponseEntity.ok().body(savedBooking);
    }

    @GetMapping("/history")
    public ResponseEntity<List<LabBooking>> getHistory(@RequestParam("mobile") String mobile) {
        if (mobile == null || mobile.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        List<LabBooking> history = labService.getBookingsByMobile(mobile);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/bookings/{id}/complete")
    public ResponseEntity<?> completeBooking(@PathVariable("id") Long bookingId) {
        try {
            // 1. Mark test completed in the database
            LabBooking completedBooking = labService.completeBooking(bookingId);

            // 2. Trigger thank-you/completed notifications asynchronously
            CompletableFuture.runAsync(() -> {
                try {
                    emailService.sendTestCompletionEmail(completedBooking);
                } catch (Exception e) {
                    System.err.println("Async completion email notification failure: " + e.getMessage());
                }
                try {
                    whatsAppService.sendCompletionWhatsApp(completedBooking);
                } catch (Exception e) {
                    System.err.println("Async completion WhatsApp notification failure: " + e.getMessage());
                }
            });

            return ResponseEntity.ok().body(completedBooking);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"An unexpected error occurred\"}");
        }
    }
}
