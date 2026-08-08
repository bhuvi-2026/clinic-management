package com.healthapp.doctor_booking;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LabBookingApplication {

    private static final Logger log = LoggerFactory.getLogger(LabBookingApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(LabBookingApplication.class, args);
        log.info("Lab booking backend is running and ready for requests!");
    }
}