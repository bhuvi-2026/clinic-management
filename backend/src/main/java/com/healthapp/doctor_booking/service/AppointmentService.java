package com.healthapp.doctor_booking.service;

import com.healthapp.doctor_booking.model.Appointment;
import com.healthapp.doctor_booking.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EmailService emailService;

    @Value("${clinic.owner.email}")
    private String ownerEmail;

    public Appointment saveAppointment(Appointment appointment) {
        // 1. Save booking to H2 (so it's recorded even if email fails)
        Appointment saved = appointmentRepository.save(appointment);
        
        // 2. Send the alert ONLY to the clinic owner
        try {
            emailService.sendBookingNotification(
                ownerEmail,            // Recipient (from properties)
                saved.getPatientName(), // Detail 1
                saved.getPatientPhone(),// Detail 2
                saved.getAppointmentSlot() // Detail 3
            );
        } catch (Exception e) {
            System.err.println("Database updated, but notification failed: " + e.getMessage());
        }
        
        return saved;
    }
}