package com.healthapp.doctor_booking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "clinic_users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String mobileNumber;

    private String currentOtp;

    public User() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
    public String getCurrentOtp() { return currentOtp; }
    public void setCurrentOtp(String currentOtp) { this.currentOtp = currentOtp; }
}