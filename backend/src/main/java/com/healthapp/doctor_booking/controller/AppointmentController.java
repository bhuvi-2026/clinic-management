package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.model.Appointment;
import com.healthapp.doctor_booking.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:4200")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public Appointment bookAppointment(@RequestBody Appointment appointment) {
        return appointmentService.saveAppointment(appointment);
    }
}