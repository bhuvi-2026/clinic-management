package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.model.HomeBasicPackage;
import com.healthapp.doctor_booking.service.LabService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/home-basic-pkgs")
@CrossOrigin(origins = "http://localhost:4200")
public class HomeBasicPackageController {

    private final LabService labService;

    public HomeBasicPackageController(LabService labService) {
        this.labService = labService;
    }

    @GetMapping
    public List<HomeBasicPackage> getHomeBasicPackages() {
        return labService.getAllHomeBasicPackages();
    }

    @PostMapping
    public ResponseEntity<HomeBasicPackage> createHomeBasicPackage(@RequestBody HomeBasicPackage pkg) {
        return ResponseEntity.ok(labService.saveHomeBasicPackage(pkg));
    }
}