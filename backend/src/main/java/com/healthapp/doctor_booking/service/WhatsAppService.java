package com.healthapp.doctor_booking.service;

import com.healthapp.doctor_booking.model.LabBooking;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {

    private final WebClient webClient;

    @Value("${lab.owner.whatsapp:919513951931}")
    private String defaultOwnerPhone;

    public WhatsAppService(@Value("${whatsapp.api.url:http://localhost:3000}") String whatsappApiUrl) {
        this.webClient = WebClient.create(whatsappApiUrl);
    }

    public void sendBookingWhatsApp(String ownerEmail, LabBooking booking) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("bookingId", booking.getId());
            payload.put("patientPhone", booking.getPatientPhone());
            payload.put("patientEmail", booking.getEmail() != null ? booking.getEmail() : "");
            payload.put("ownerEmail", ownerEmail != null ? ownerEmail : "");
            payload.put("packageName", booking.getPackageName());
            payload.put("schedule", booking.getSchedule());
            payload.put("address", booking.getAddress());
            payload.put("patientCount", booking.getPatientCount());
            payload.put("ownerPhone", defaultOwnerPhone);

            this.webClient.post()
                    .uri("/api/whatsapp/send-booking")
                    .bodyValue(payload)
                    .retrieve()
                    .toBodilessEntity()
                    .subscribe(
                        res -> System.out.println("WhatsApp Booking Notification Sent successfully to patient & owner."),
                        err -> System.err.println("WhatsApp Notification Error: " + err.getMessage())
                    );
        } catch (Exception e) {
            System.err.println("Failed to invoke WhatsApp service for booking: " + e.getMessage());
        }
    }

    public void sendCompletionWhatsAppWithPdf(LabBooking booking, String pdfBase64) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("bookingId", booking.getId());
            payload.put("patientPhone", booking.getPatientPhone());
            payload.put("packageName", booking.getPackageName());
            payload.put("schedule", booking.getSchedule());
            payload.put("pdfBase64", pdfBase64 != null ? pdfBase64 : "");

            this.webClient.post()
                    .uri("/api/whatsapp/send-completion")
                    .bodyValue(payload)
                    .retrieve()
                    .toBodilessEntity()
                    .subscribe(
                        res -> System.out.println("WhatsApp Completion + PDF Report sent to patient."),
                        err -> System.err.println("WhatsApp Completion Error: " + err.getMessage())
                    );
        } catch (Exception e) {
            System.err.println("Failed to invoke WhatsApp completion: " + e.getMessage());
        }
    }
}