package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.model.Appointment;
import com.healthapp.doctor_booking.repository.AppointmentRepository;
import com.healthapp.doctor_booking.service.AppointmentService;
import com.healthapp.doctor_booking.service.ZoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:4200")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ZoomService zoomService;

    @Value("${CLINIC_OWNER_EMAIL:}")
    private String ownerEmail;

    @PostMapping
    public Appointment bookAppointment(@RequestBody Appointment app) {
        try {
            if (app.getDoctor() != null) {
                String localTime = app.getAppointmentSlot().replace(" ", "T");

                // Zoom expects ISO 8601. For India (+05:30), we append the offset.
                // This ensures the meeting is scheduled at the exact local time in India.
                String zoomTimeIST = localTime + ":00+05:30";

                Map<String, String> zoomData = zoomService.createMeeting(
                        "Consultation: " + app.getPatientName() + " with " + app.getDoctor().getName(),
                        zoomTimeIST);

                // Attach URLs to the object
                app.setZoomJoinUrl(zoomData.get("join_url"));
                app.setZoomStartUrl(zoomData.get("start_url"));
                app.setStatus("UPCOMING");
            }
        } catch (Exception e) {
            System.err.println("Zoom Creation Failed: " + e.getMessage());
            app.setStatus("PENDING_ZOOM");
        }

        return appointmentService.saveAppointment(app, ownerEmail);
    }

    @GetMapping("/history/{email}")
    public ResponseEntity<List<Appointment>> getBookingHistory(@PathVariable String email) {
        List<Appointment> history = appointmentRepository.findByUserEmailOrderByBookingTimeDesc(email);
        return ResponseEntity.ok(history);
    }
}