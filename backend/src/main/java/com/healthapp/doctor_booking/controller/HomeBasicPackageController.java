package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.model.HomeBasicPackage;
import com.healthapp.doctor_booking.service.LabService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/home-basic-pkgs")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HomeBasicPackageController {

    private final LabService labService;

    public HomeBasicPackageController(LabService labService) {
        this.labService = labService;
    }

    @GetMapping
    public ResponseEntity<List<HomeBasicPackage>> getHomeBasicPackages() {
        return ResponseEntity.ok(labService.getAllHomeBasicPackages());
    }

    @PostMapping
    public ResponseEntity<HomeBasicPackage> createHomeBasicPackage(@RequestBody HomeBasicPackage pkg) {
        return ResponseEntity.ok(labService.saveHomeBasicPackage(pkg));
    }
}