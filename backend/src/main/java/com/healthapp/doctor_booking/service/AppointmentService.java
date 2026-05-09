package com.healthapp.doctor_booking.service;

import com.healthapp.doctor_booking.model.Appointment;
import com.healthapp.doctor_booking.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private EmailService emailService;

    public Appointment saveAppointment(Appointment appointment, String ownerEmail) {
        // 1. Save to Database
        Appointment saved = appointmentRepository.save(appointment);
        System.out.println("Appointment saved to DB. ID: " + saved.getId());

        System.out.println("Attempting to notify owner: [" + ownerEmail + "]");
        
        // 2. Notify Owner via Email
        if (ownerEmail != null && !ownerEmail.isEmpty()) {
            try {
                String docName = (saved.getDoctor() != null) ? saved.getDoctor().getName() : "General Checkup";

                // Pass the Zoom URLs from the saved object to the email service
                emailService.sendBookingNotification(
                    ownerEmail, 
                    saved.getPatientName(), 
                    saved.getPatientPhone(), 
                    saved.getAppointmentSlot(),
                    docName,
                    saved.getZoomJoinUrl(), // Fixed: pulling from the object
                    saved.getZoomStartUrl()  // Fixed: pulling from the object
                );
            } catch (Exception e) {
                System.err.println("Notification Email failed: " + e.getMessage());
            }
        }
        return saved;
    }
}