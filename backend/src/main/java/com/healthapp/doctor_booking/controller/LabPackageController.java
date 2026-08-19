package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.model.LabBooking;
import com.healthapp.doctor_booking.model.LabBookingRequest;
import com.healthapp.doctor_booking.model.LabPackage;
import com.healthapp.doctor_booking.service.EmailService;
import com.healthapp.doctor_booking.service.LabService;
import com.healthapp.doctor_booking.service.WhatsAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/lab-packages")
@CrossOrigin(
    origins = "*", 
    allowedHeaders = "*", 
    methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS }
)
public class LabPackageController {

    @Autowired
    private LabService labService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private WhatsAppService whatsAppService;

    @Value("${admin.secret.key:ThyronexAdmin@2026}")
    private String adminSecretKey;

    @Value("${lab.owner.email:bhuvis459@gmail.com}")
    private String defaultOwnerEmail;

    // =========================================================================
    // 1. GET ALL PACKAGES (Calls labService.getAllPackages())
    // =========================================================================
    @GetMapping
    public ResponseEntity<List<LabPackage>> getAllLabPackages() {
        List<LabPackage> packages = labService.getAllPackages();
        return ResponseEntity.ok(packages);
    }

    // =========================================================================
    // 2. CONFIRM BOOKING (Calls labService.bookTest(request))
    // =========================================================================
    @PostMapping(value = {"/confirm-booking", "/bookings"})
    public ResponseEntity<?> confirmBooking(
            @RequestBody LabBookingRequest request,
            @RequestHeader(value = "Clinic-Owner-Email", required = false) String ownerEmailHeader) {
        try {
            if (request.getPackageName() == null || request.getPackageName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Package name is required"));
            }
            if (request.getPatientPhone() == null || request.getPatientPhone().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Patient phone number is required"));
            }

            // 1. Save booking via your LabService
            LabBooking savedBooking = labService.bookTest(request);

            final String resolvedOwnerEmail = (ownerEmailHeader != null && !ownerEmailHeader.trim().isEmpty()) 
                    ? ownerEmailHeader 
                    : defaultOwnerEmail;

            // 2. Dispatch Email & WhatsApp asynchronously in background
            CompletableFuture.runAsync(() -> {
                try {
                    emailService.sendLabBookingNotificationToOwner(resolvedOwnerEmail, savedBooking);
                    emailService.sendLabBookingConfirmationToUser(savedBooking);
                } catch (Exception ex) {
                    System.err.println("[EMAIL NOTIFICATION ERROR] " + ex.getMessage());
                }
                try {
                    whatsAppService.sendBookingWhatsApp(resolvedOwnerEmail, savedBooking);
                } catch (Exception ex) {
                    System.err.println("[WHATSAPP NOTIFICATION ERROR] " + ex.getMessage());
                }
            });

            return ResponseEntity.ok(savedBooking);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to save booking: " + e.getMessage()));
        }
    }

    // =========================================================================
    // 3. BOOKING HISTORY (Calls labService.getBookingsByMobile(mobile))
    // =========================================================================
    @GetMapping(value = {"/history", "/bookings/history"})
    public ResponseEntity<?> getBookingHistory(@RequestParam("mobile") String mobile) {
        if (mobile == null || mobile.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mobile parameter is required"));
        }
        List<LabBooking> history = labService.getBookingsByMobile(mobile);
        return ResponseEntity.ok(history);
    }

    // =========================================================================
    // 4. ADMIN: GET ALL BOOKINGS (Calls labService.getAllBookings())
    // =========================================================================
    @GetMapping("/admin/all-bookings")
    public ResponseEntity<?> getAllBookingsForAdmin(@RequestHeader(value = "X-Admin-Key", required = false) String key) {
        if (key == null || !key.equals(adminSecretKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access"));
        }
        List<LabBooking> bookings = labService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // =========================================================================
    // 5. ADMIN: SUBMIT REPORT & COMPLETE (Calls labService.completeBooking(id, json))
    // =========================================================================
    @PostMapping("/bookings/{id}/submit-report")
    public ResponseEntity<?> submitReport(
            @PathVariable("id") Long bookingId,
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "X-Admin-Key", required = false) String key) {

        if (key == null || !key.equals(adminSecretKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized Admin Key"));
        }

        try {
            String reportJson = payload.get("reportJson") != null ? payload.get("reportJson").toString() : null;
            String pdfBase64 = payload.get("pdfBase64") != null ? payload.get("pdfBase64").toString() : null;

            // Update status to COMPLETED and store report JSON via LabService
            LabBooking updatedBooking = labService.completeBooking(bookingId, reportJson);

            // Dispatch PDF Report via Email & WhatsApp asynchronously
            CompletableFuture.runAsync(() -> {
                try {
                    emailService.sendTestCompletionWithPdf(updatedBooking, pdfBase64);
                } catch (Exception ex) {
                    System.err.println("[EMAIL COMPLETION ERROR] " + ex.getMessage());
                }
                try {
                    whatsAppService.sendCompletionWhatsAppWithPdf(updatedBooking, pdfBase64);
                } catch (Exception ex) {
                    System.err.println("[WHATSAPP COMPLETION ERROR] " + ex.getMessage());
                }
            });

            return ResponseEntity.ok(updatedBooking);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to submit report: " + e.getMessage()));
        }
    }
}