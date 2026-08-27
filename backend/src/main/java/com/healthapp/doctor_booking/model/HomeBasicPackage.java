package com.healthapp.doctor_booking.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "home_basic_packages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomeBasicPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private int testCount;

    private int discountPercentage;

    @Column(name = "parameters_summary", columnDefinition = "TEXT")
    private String parametersSummary;

    @Column(nullable = false)
    private Double price;

    private Double originalPrice;

    private boolean fastingRequired;
}