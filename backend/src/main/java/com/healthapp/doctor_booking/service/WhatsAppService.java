package com.healthapp.doctor_booking.service;

import com.healthapp.doctor_booking.model.LabBooking;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {

    private final WebClient webClient;

    @Value("${lab.owner.whatsapp:}")
    private String defaultOwnerPhone;

    public WhatsAppService(@Value("${whatsapp.api.url:http://localhost:3000}") String whatsappApiUrl) {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(50 * 1024 * 1024))
                .build();

        this.webClient = WebClient.builder()
                .baseUrl(whatsappApiUrl)
                .exchangeStrategies(strategies)
                .build();
    }

    // 1. Dispatch OTP notification to patient's WhatsApp
    public void sendOtpWhatsApp(String patientPhone, String otp) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("patientPhone", patientPhone);
            payload.put("otp", otp);

            this.webClient.post()
                    .uri("/api/whatsapp/send-otp")
                    .bodyValue(payload)
                    .retrieve()
                    .toBodilessEntity()
                    .subscribe(
                        res -> System.out.println("[WHATSAPP SUCCESS] OTP dispatched to: " + patientPhone),
                        err -> System.err.println("[WHATSAPP ERROR] Failed to dispatch OTP: " + err.getMessage())
                    );
        } catch (Exception e) {
            System.err.println("Failed to invoke WhatsApp service for OTP: " + e.getMessage());
        }
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

    public void sendCompletionWhatsAppWithPdf(LabBooking booking, String pdfBase64, String fileName) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("bookingId", booking.getId());
            payload.put("patientPhone", booking.getPatientPhone());
            payload.put("packageName", booking.getPackageName());
            payload.put("schedule", booking.getSchedule());
            payload.put("pdfBase64", pdfBase64 != null ? pdfBase64 : "");
            payload.put("fileName", fileName != null ? fileName : ("Thyronex_" + booking.getId() + ".pdf"));

            this.webClient.post()
                    .uri("/api/whatsapp/send-completion")
                    .bodyValue(payload)
                    .retrieve()
                    .toBodilessEntity()
                    .subscribe(
                        res -> System.out.println("[WHATSAPP SUCCESS] Completion + PDF dispatched to WhatsApp microservice."),
                        err -> System.err.println("[WHATSAPP ERROR] Failed to send to microservice: " + err.getMessage())
                    );
        } catch (Exception e) {
            System.err.println("Failed to invoke WhatsApp completion: " + e.getMessage());
        }
    }
}