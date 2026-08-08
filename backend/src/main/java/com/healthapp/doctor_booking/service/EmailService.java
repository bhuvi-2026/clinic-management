package com.healthapp.doctor_booking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // Import this
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.healthapp.doctor_booking.model.LabBookingRequest;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // This pulls the value directly from your application.properties
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendLabBookingNotification(String ownerEmail, LabBookingRequest details) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(ownerEmail);
        message.setSubject("LAB TEST REQUEST: " + details.getPackageName());

        String content = "Hello Owner,\n\n" +
                "A NEW BLOOD TEST @ HOME has been booked.\n\n" +
                "--- TEST INFO ---\n" +
                "Package: " + details.getPackageName() + "\n" +
                "Schedule: " + details.getSchedule() + "\n" +
                "Patients: " + details.getPatientCount() + "\n\n" +
                "--- COLLECTION INFO ---\n" +
                "Address: " + details.getAddress() + "\n" +
                "Email: " + details.getEmail() + "\n\n" +
                "Regards,\nHealthApp Team";

        message.setText(content);
        mailSender.send(message);
        System.out.println("Notification email successfully sent from: " + fromEmail);
    }
}