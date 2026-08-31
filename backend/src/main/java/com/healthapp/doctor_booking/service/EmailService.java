package com.healthapp.doctor_booking.service;

import java.util.Base64;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthapp.doctor_booking.model.LabBooking;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:blrrudresh972@gmail.com}")
    private String fromEmail;

    @Value("${lab.owner.email:bhuvis459@gmail.com}")
    private String defaultOwnerEmail;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    public boolean isValidEmail(String email) {
        return email != null && !email.trim().isEmpty() && EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    // 1. Notification to Lab Owner when a new test is booked
    public void sendLabBookingNotificationToOwner(String ownerEmail, LabBooking details) {
        String recipient = isValidEmail(ownerEmail) ? ownerEmail.trim() : defaultOwnerEmail;
        try {
            if (mailSender == null) return;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipient);
            message.setSubject("🚨 NEW LAB TEST BOOKED: " + details.getPackageName() + " (ID: #" + details.getId() + ")");

            String content = "Hello Lab Owner,\n\nA NEW BLOOD TEST @ HOME has been booked.\n\n"
                    + "Booking ID: #" + details.getId() + "\n"
                    + "Patient Name(s): " + (details.getPatientName() != null ? details.getPatientName() : "N/A") + "\n"
                    + "Package: " + details.getPackageName() + "\n"
                    + "Schedule: " + details.getSchedule() + "\n"
                    + "Patients Count: " + details.getPatientCount() + "\n"
                    + "Address: " + details.getAddress() + "\n"
                    + "Patient Phone: " + details.getPatientPhone() + "\n"
                    + "Patient Email: " + (details.getEmail() != null ? details.getEmail() : "N/A") + "\n\n"
                    + "Regards,\nThyronex Health Care";

            message.setText(content);
            mailSender.send(message);
            System.out.println("Notification email successfully sent to lab owner: " + recipient);
        } catch (Exception e) {
            System.err.println("Booking Notification Email error: " + e.getMessage());
        }
    }

    // 2. Booking confirmation to Patient
    public void sendLabBookingConfirmationToUser(LabBooking details) {
        if (!isValidEmail(details.getEmail())) {
            return;
        }
        try {
            if (mailSender == null) return;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(details.getEmail().trim());
            message.setSubject("🏥 Thyronex Care - Booking Confirmed! (ID: #" + details.getId() + ")");

            String content = "Dear Customer,\n\n"
                    + "Thank you for choosing Thyronex Care. Your home lab test booking has been confirmed successfully!\n\n"
                    + "--- YOUR BOOKING DETAILS ---\n"
                    + "Booking ID: #" + details.getId() + "\n"
                    + "Patient(s): " + (details.getPatientName() != null ? details.getPatientName() : "Valued Patient") + "\n"
                    + "Package: " + details.getPackageName() + "\n"
                    + "Schedule: " + details.getSchedule() + "\n"
                    + "Patients: " + details.getPatientCount() + "\n"
                    + "Hardcopy Requested: " + (details.isHardcopy() ? "Yes" : "No") + "\n\n"
                    + "--- COLLECTION ADDRESS ---\n"
                    + "Address: " + details.getAddress() + "\n"
                    + "Contact Phone: " + details.getPatientPhone() + "\n\n"
                    + "Our representative will arrive at your address during the scheduled time slot.\n\n"
                    + "Regards,\nThyronex Health Care Team";

            message.setText(content);
            mailSender.send(message);
            System.out.println("Confirmation email sent to patient: " + details.getEmail());
        } catch (Exception e) {
            System.err.println("Failed to send booking confirmation email to patient: " + e.getMessage());
        }
    }

    // 3. Send Completed Report PDF(s) to Patient
    public void sendTestCompletionWithPdf(LabBooking details, String pdfBase64) {
        if (!isValidEmail(details.getEmail())) {
            System.out.println("[INFO] Skipped sending Email PDF: No valid email provided for Booking #" + details.getId());
            return;
        }

        try {
            if (mailSender == null) return;

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(details.getEmail().trim());
            helper.setSubject("🧪 Diagnostic Reports Available - " + details.getPackageName() + " (Booking #" + details.getId() + ")");

            String htmlBody = "<div style='font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto;'>"
                    + "<div style='background-color: #1a5f6e; padding: 18px; border-radius: 8px 8px 0 0; text-align: center; color: white;'>"
                    + "<h2 style='margin: 0;'>Thyronex Health Care</h2>"
                    + "<p style='margin: 4px 0 0 0; font-size: 13px;'>Official Diagnostic Test Reports</p>"
                    + "</div>"
                    + "<div style='padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;'>"
                    + "<p>Dear Customer,</p>"
                    + "<p>The diagnostic reports for <strong>" + details.getPackageName() + "</strong> (Booking <strong>#" + details.getId() + "</strong>) have been verified by our pathologists.</p>"
                    + "<p><strong>Patient(s):</strong> " + (details.getPatientName() != null ? details.getPatientName() : "Valued Patient") + "</p>"
                    + "<p>Please find attached the official PDF report softcopies.</p>"
                    + "<p>You can also download your reports anytime from <strong>'My Bookings'</strong> on our portal.</p>"
                    + "<hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;'>"
                    + "<p style='font-size: 12px; color: #64748b;'>Thyronex Health Care & Laboratory<br>Toll Free: +91 80880 73507</p>"
                    + "</div></div>";

            helper.setText(htmlBody, true);

            // Multi-patient reports attachment using Jackson ObjectMapper
            boolean hasAttached = false;
            if (details.getReportData() != null && !details.getReportData().trim().isEmpty()) {
                try {
                    JsonNode rootNode = objectMapper.readTree(details.getReportData());
                    if (rootNode.has("reports") && rootNode.get("reports").isArray()) {
                        for (JsonNode repNode : rootNode.get("reports")) {
                            String b64 = repNode.has("pdfBase64") ? repNode.get("pdfBase64").asText() : "";
                            String pName = repNode.has("patientName") ? repNode.get("patientName").asText() : "Patient";
                            String cleanName = pName.replaceAll("[^a-zA-Z0-9_-]", "_");

                            if (b64.contains("base64,")) {
                                byte[] bytes = Base64.getDecoder().decode(b64.split("base64,")[1]);
                                helper.addAttachment("Thyronex_Report_" + cleanName + ".pdf", new ByteArrayResource(bytes));
                                hasAttached = true;
                            }
                        }
                    }
                } catch (Exception ex) {
                    System.err.println("[EMAIL WARNING] Could not parse multi-report JSON: " + ex.getMessage());
                }
            }

            // Fallback to single base64 if not multi-attached
            if (!hasAttached && pdfBase64 != null && pdfBase64.contains("base64,")) {
                byte[] pdfBytes = Base64.getDecoder().decode(pdfBase64.split("base64,")[1]);
                helper.addAttachment("Thyronex_Report_Booking_" + details.getId() + ".pdf", new ByteArrayResource(pdfBytes));
            }

            mailSender.send(mimeMessage);
            System.out.println("[SUCCESS] Diagnostic Softcopy PDF email sent to: " + details.getEmail());
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to send diagnostic report email: " + e.getMessage());
        }
    }

    // 4. Test Completion Simple Notification (Optional)
    public void sendTestCompletionEmail(LabBooking details) {
        if (!isValidEmail(details.getEmail())) {
            return;
        }
        try {
            if (mailSender == null) return;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(details.getEmail().trim());
            message.setSubject("🧪 Thyronex Care - Test Completed! (ID: #" + details.getId() + ")");

            String content = "Dear Customer,\n\n"
                    + "Your booked test has been completed! We appreciate your trust in Thyronex Care.\n\n"
                    + "--- COMPLETED TEST INFO ---\n"
                    + "Booking ID: #" + details.getId() + "\n"
                    + "Package: " + details.getPackageName() + "\n"
                    + "Schedule: " + details.getSchedule() + "\n\n"
                    + "Your report will be available in your portal shortly. Thank you for choosing us!\n\n"
                    + "Regards,\nThyronex Health Care Team";

            message.setText(content);
            mailSender.send(message);
            System.out.println("Test completion email sent to patient: " + details.getEmail());
        } catch (Exception e) {
            System.err.println("Failed to send test completion email to patient: " + e.getMessage());
        }
    }
}