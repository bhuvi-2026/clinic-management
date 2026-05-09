package com.healthapp.doctor_booking.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "lab_packages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private int testCount;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Double price;

    private Double originalPrice;

    private boolean fastingRequired;
}