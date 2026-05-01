package com.healthapp.doctor_booking.repository;

import com.healthapp.doctor_booking.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    // JpaRepository gives us built-in methods like save(), findAll(), and findById() automatically!
}