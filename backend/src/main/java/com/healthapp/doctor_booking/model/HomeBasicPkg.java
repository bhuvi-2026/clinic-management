package com.healthapp.doctor_booking.model; // Use your actual package path

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "home_basic_pkgs")
@Data
public class HomeBasicPkg {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer testCount;
    private Integer discountPercentage;
    
    @Column(columnDefinition = "TEXT")
    private String parametersSummary; // e.g., "Lipid Profile (8)\nLiver Function Test (11)\nKidney Function Test (8)"

    private Double price;
    private Double originalPrice;
    private Boolean fastingRequired;
}