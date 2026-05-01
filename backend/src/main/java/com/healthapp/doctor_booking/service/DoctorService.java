package com.healthapp.doctor_booking.service;

import com.healthapp.doctor_booking.model.Doctor;
import com.healthapp.doctor_booking.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    // Method to get a list of all doctors
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // Method to add a new doctor to the database
    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }
}