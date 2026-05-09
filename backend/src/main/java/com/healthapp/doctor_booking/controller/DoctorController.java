package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.model.Doctor;
import com.healthapp.doctor_booking.repository.DoctorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:4200")
public class DoctorController {

    private static final Logger log = LoggerFactory.getLogger(DoctorController.class);

    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @PostMapping
    public List<Doctor> addDoctor(@RequestBody List<Doctor> doctors) {
        log.info("Adding new doctor: {}", doctors.size());
        return doctorRepository.saveAll(doctors);
    }

    // THE FIX: Adding a specific name to PathVariable to ensure mapping
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteDoctor(@PathVariable("id") Long id) {
        log.info("Attempting to delete doctor with ID: {}", id);
        
        return doctorRepository.findById(id)
            .map(doctor -> {
                doctorRepository.delete(doctor);
                log.info("Successfully deleted doctor ID: {}", id);
                return ResponseEntity.noContent().build(); // Returns 204
            })
            .orElseGet(() -> {
                log.warn("Failed to delete. Doctor ID {} not found", id);
                return ResponseEntity.notFound().build(); // Returns 404
            });
    }
}