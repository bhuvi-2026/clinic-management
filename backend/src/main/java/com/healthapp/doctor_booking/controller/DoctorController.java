package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.model.Doctor;
import com.healthapp.doctor_booking.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:4200")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    // GET all doctors (for your Angular UI)
    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // POST a new doctor (for Postman)
    @PostMapping
    public ResponseEntity<Doctor> addDoctor(@RequestBody Doctor doctor) {
        Doctor savedDoctor = doctorRepository.save(doctor);
        return new ResponseEntity<>(savedDoctor, HttpStatus.CREATED);
    }
    

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {

        return doctorRepository.findById(id)
                .map(doctor -> {
                    doctorRepository.delete(doctor);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> {
                    return ResponseEntity.notFound().build();
                });
    }
}