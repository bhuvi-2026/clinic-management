package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.dto.LabPackageDTO;
import com.healthapp.doctor_booking.model.LabBooking;
import com.healthapp.doctor_booking.model.LabBookingRequest;
import com.healthapp.doctor_booking.service.EmailService;
import com.healthapp.doctor_booking.service.LabService;
import com.healthapp.doctor_booking.service.WhatsAppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/lab-packages")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LabPackageController {

    @Autowired
    private LabService labService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private WhatsAppService whatsAppService;

    @Value("${admin.secret.key}")
    private String adminSecretKey;

    @Value("${lab.owner.email}")
    private String defaultOwnerEmail;

    @Value("${lab.contact.phone:}")
    private String contactPhone;

    @Value("${lab.contact.name:}")
    private String contactName;

    @Value("${lab.contact.timings:}")
    private String contactTimings;

    // =========================================================================
    // 1. GET PACKAGES (Supports ?category=FullBody, Diabetic, HeartCare, etc.)
    // =========================================================================
    @GetMapping
    public ResponseEntity<List<LabPackageDTO>> getLabPackages(
            @RequestParam(value = "category", required = false, defaultValue = "ALL") String category) {
        List<LabPackageDTO> packages = labService.getPackagesByCategory(category);
        return ResponseEntity.ok(packages);
    }

    // =========================================================================
    // 2. CONFIRM BOOKING (Async Notification Pipeline)
    // =========================================================================
    @PostMapping(value = { "/confirm-booking", "/bookings" })
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

            LabBooking savedBooking = labService.bookTest(request);
            final String resolvedOwnerEmail = (ownerEmailHeader != null && !ownerEmailHeader.trim().isEmpty()) 
                    ? ownerEmailHeader : defaultOwnerEmail;

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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to save booking: " + e.getMessage()));
        }
    }

    // =========================================================================
    // 3. BOOKING HISTORY
    // =========================================================================
    @GetMapping(value = { "/history", "/bookings/history" })
    public ResponseEntity<?> getBookingHistory(@RequestParam("mobile") String mobile) {
        if (mobile == null || mobile.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mobile parameter is required"));
        }
        return ResponseEntity.ok(labService.getBookingsByMobile(mobile));
    }

    // =========================================================================
    // 4. ADMIN: GET ALL BOOKINGS
    // =========================================================================
    @GetMapping("/admin/all-bookings")
    public ResponseEntity<?> getAllBookingsForAdmin(
            @RequestHeader(value = "X-Admin-Key", required = false) String key) {
        if (key == null || !key.equals(adminSecretKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized access"));
        }
        return ResponseEntity.ok(labService.getAllBookings());
    }

    // =========================================================================
    // 5. ADMIN: COMPLETE BOOKING & DISPATCH REPORT
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

            LabBooking updatedBooking = labService.completeBooking(bookingId, reportJson);

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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to submit report: " + e.getMessage()));
        }
    }

    // =========================================================================
    // 6. CONTACT INFORMATION
    // =========================================================================
    @GetMapping("/contact-info")
    public ResponseEntity<Map<String, String>> getContactInfo() {
        Map<String, String> info = new HashMap<>();
        info.put("phone", contactPhone);
        info.put("inCharge", contactName);
        info.put("timings", contactTimings);
        return ResponseEntity.ok(info);
    }
}