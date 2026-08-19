package com.healthapp.doctor_booking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lab_packages")
public class LabPackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private int testCount;
    private double price;
    private Double originalPrice;

    @Column(columnDefinition = "TEXT")
    private String description;

    private boolean fastingRequired;

    @Column(columnDefinition = "TEXT")
    private String detailsJson;

    public LabPackage() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getTestCount() { return testCount; }
    public void setTestCount(int testCount) { this.testCount = testCount; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isFastingRequired() { return fastingRequired; }
    public void setFastingRequired(boolean fastingRequired) { this.fastingRequired = fastingRequired; }

    public String getDetailsJson() { return detailsJson; }
    public void setDetailsJson(String detailsJson) { this.detailsJson = detailsJson; }
}