package com.healthapp.doctor_booking.service;

import com.healthapp.doctor_booking.model.LabPackage;
import com.healthapp.doctor_booking.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LabService {

    private final LabPackageRepository labPackageRepository;

    public LabService(LabPackageRepository labPackageRepository) {
        this.labPackageRepository = labPackageRepository;
    }

    public List<LabPackage> getAllPackages() {
        return labPackageRepository.findAll();
    }

    public LabPackage savePackage(LabPackage labPackage) {
        return labPackageRepository.save(labPackage);
    }
}