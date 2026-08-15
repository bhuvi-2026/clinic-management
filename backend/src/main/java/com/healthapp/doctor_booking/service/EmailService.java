package com.healthapp.doctor_booking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.healthapp.doctor_booking.model.LabBooking;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:blrrudresh972@gmail.com}")
    private String fromEmail;

    @Value("${lab.owner.email:bhuvis459@gmail.com}")
    private String defaultOwnerEmail;

    public void sendLabBookingNotificationToOwner(String ownerEmail, LabBooking details) {
        String recipient = (ownerEmail != null && !ownerEmail.trim().isEmpty()) ? ownerEmail : defaultOwnerEmail;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipient);
            message.setSubject("🚨 NEW LAB TEST BOOKED: " + details.getPackageName() + " (ID: #" + details.getId() + ")");

            String content = "Hello Lab Owner,\n\n" +
                    "A NEW BLOOD TEST @ HOME has been booked.\n\n" +
                    "--- BOOKING DETAILS ---\n" +
                    "Booking ID: #" + details.getId() + "\n" +
                    "Package: " + details.getPackageName() + "\n" +
                    "Schedule: " + details.getSchedule() + "\n" +
                    "Patients: " + details.getPatientCount() + "\n\n" +
                    "--- COLLECTION INFO ---\n" +
                    "Address: " + details.getAddress() + "\n" +
                    "Patient Phone: " + details.getPatientPhone() + "\n" +
                    "Patient Email: " + details.getEmail() + "\n\n" +
                    "Regards,\nThyronex Care Team";

            message.setText(content);
            if (mailSender != null) {
                mailSender.send(message);
                System.out.println("Notification email successfully sent to lab owner: " + recipient);
            } else {
                System.out.println("MailSender not configured. Print to console:\n" + content);
            }
        } catch (Exception e) {
            System.err.println("Failed to send booking notification email to owner: " + e.getMessage());
        }
    }

    public void sendLabBookingConfirmationToUser(LabBooking details) {
        if (details.getEmail() == null || details.getEmail().trim().isEmpty()) {
            System.out.println("No email provided for patient, skipping confirmation email.");
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(details.getEmail());
            message.setSubject("🏥 Thyronex Care - Booking Confirmed! (ID: #" + details.getId() + ")");

            String content = "Dear Customer,\n\n" +
                    "Thank you for choosing Thyronex Care. Your home lab test booking has been confirmed successfully!\n\n" +
                    "--- YOUR BOOKING DETAILS ---\n" +
                    "Booking ID: #" + details.getId() + "\n" +
                    "Package: " + details.getPackageName() + "\n" +
                    "Schedule: " + details.getSchedule() + "\n" +
                    "Patients: " + details.getPatientCount() + "\n" +
                    "Hardcopy Requested: " + (details.isHardcopy() ? "Yes" : "No") + "\n\n" +
                    "--- COLLECTION ADDRESS ---\n" +
                    "Address: " + details.getAddress() + "\n" +
                    "Contact Phone: " + details.getPatientPhone() + "\n\n" +
                    "Our representative will arrive at your address during the scheduled time. Please fast if required by the test package.\n\n" +
                    "For any support, contact us at " + fromEmail + ".\n\n" +
                    "Regards,\nThyronex Care Diagnostics Team";

            message.setText(content);
            if (mailSender != null) {
                mailSender.send(message);
                System.out.println("Confirmation email successfully sent to patient: " + details.getEmail());
            } else {
                System.out.println("MailSender not configured. Print to console:\n" + content);
            }
        } catch (Exception e) {
            System.err.println("Failed to send booking confirmation email to patient: " + e.getMessage());
        }
    }

    public void sendTestCompletionEmail(LabBooking details) {
        if (details.getEmail() == null || details.getEmail().trim().isEmpty()) {
            System.out.println("No email provided for patient, skipping completion email.");
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(details.getEmail());
            message.setSubject("🧪 Thyronex Care - Test Completed! (ID: #" + details.getId() + ")");

            String content = "Dear Customer,\n\n" +
                    "Your booked test has been completed! We appreciate your trust in Thyronex Care.\n\n" +
                    "--- COMPLETED TEST INFO ---\n" +
                    "Booking ID: #" + details.getId() + "\n" +
                    "Package: " + details.getPackageName() + "\n" +
                    "Schedule: " + details.getSchedule() + "\n\n" +
                    "Your report will be sent to this email address shortly. Thank you for choosing us!\n\n" +
                    "Regards,\nThyronex Care Diagnostics Team";

            message.setText(content);
            if (mailSender != null) {
                mailSender.send(message);
                System.out.println("Test completion email successfully sent to patient: " + details.getEmail());
            } else {
                System.out.println("MailSender not configured. Print to console:\n" + content);
            }
        } catch (Exception e) {
            System.err.println("Failed to send test completion email to patient: " + e.getMessage());
        }
    }
}
