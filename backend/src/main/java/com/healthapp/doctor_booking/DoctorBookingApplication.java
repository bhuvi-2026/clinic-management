package com.healthapp.doctor_booking;

import com.healthapp.doctor_booking.model.Doctor;
import com.healthapp.doctor_booking.repository.DoctorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class DoctorBookingApplication {

    // 1. Create the Logger instance for this class
    private static final Logger log = LoggerFactory.getLogger(DoctorBookingApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(DoctorBookingApplication.class, args);
        log.info("Clinic Backend is running and ready for Postman requests!");
    }

}