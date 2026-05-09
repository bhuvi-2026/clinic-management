package com.healthapp.doctor_booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healthapp.doctor_booking.model.LabPackage;

@Repository
public interface LabPackageRepository extends JpaRepository<LabPackage, Long> {
    // Standard CRUD methods are automatically provided
}