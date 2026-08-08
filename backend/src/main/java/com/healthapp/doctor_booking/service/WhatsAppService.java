package com.healthapp.doctor_booking.service;

import com.healthapp.doctor_booking.model.LabBookingRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {

    private final WebClient webClient;

    public WhatsAppService() {
        this.webClient = WebClient.create("http://localhost:3000");
    }

    public void sendBookingWhatsApp(String ownerEmail, LabBookingRequest request) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("patientPhone", request.getPatientPhone());
            payload.put("ownerEmail", ownerEmail);
            payload.put("packageName", request.getPackageName());
            payload.put("schedule", request.getSchedule());
            payload.put("address", request.getAddress());
            payload.put("patientCount", request.getPatientCount());

            this.webClient.post()
                    .uri("/api/whatsapp/send-booking")
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(String.class)
                    .subscribe(
                        res -> System.out.println("WhatsApp Notification Sent: " + res),
                        err -> System.err.println("WhatsApp Notification Error: " + err.getMessage())
                    );
        } catch (Exception e) {
            System.err.println("Failed to invoke WhatsApp service: " + e.getMessage());
        }
    }
}