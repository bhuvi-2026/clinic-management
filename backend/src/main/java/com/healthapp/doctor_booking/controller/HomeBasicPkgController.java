package com.healthapp.doctor_booking.controller;

import com.healthapp.doctor_booking.model.HomeBasicPkg;
import com.healthapp.doctor_booking.repository.HomeBasicPkgRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/home-basic-pkgs")
@CrossOrigin(origins = "*")
public class HomeBasicPkgController {

    private final HomeBasicPkgRepository repository;

    public HomeBasicPkgController(HomeBasicPkgRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<HomeBasicPkg> getAllPackages() {
        return repository.findAll();
    }

    // Accepts the JSON Array directly
    @PostMapping
    public List<HomeBasicPkg> createPackages(@RequestBody List<HomeBasicPkg> packages) {
        return repository.saveAll(packages);
    }
}