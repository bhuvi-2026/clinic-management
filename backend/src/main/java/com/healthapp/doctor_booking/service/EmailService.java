package com.healthapp.doctor_booking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // Import this
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // This pulls the value directly from your application.properties
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendBookingNotification(String ownerEmail, String patientName, String patientPhone, String slot) {
        SimpleMailMessage message = new SimpleMailMessage();
        
        // Use the variable instead of a hardcoded string
        message.setFrom(fromEmail); 
        message.setTo(ownerEmail);
        message.setSubject("New Appointment Booking: " + patientName);
        
        message.setText("Hello Owner,\n\n" +
                        "A new booking has been confirmed via the website.\n\n" +
                        "Patient Name: " + patientName + "\n" +
                        "Phone Number: " + patientPhone + "\n" +
                        "Time Slot: " + slot + "\n\n" +
                        "Please check your dashboard for details.");

        mailSender.send(message); 
        System.out.println("Notification email successfully sent from: " + fromEmail);
    }
}