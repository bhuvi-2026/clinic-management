package com.healthapp.doctor_booking.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clinic_users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String mobileNumber;

    private String currentOtp;

    private LocalDateTime otpExpiry;

    private LocalDateTime lastOtpRequestedAt;

    private Integer otpAttemptCount = 0;

    public User() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
    public String getCurrentOtp() { return currentOtp; }
    public void setCurrentOtp(String currentOtp) { this.currentOtp = currentOtp; }

    public LocalDateTime getOtpExpiry() { return otpExpiry; }
    public void setOtpExpiry(LocalDateTime otpExpiry) { this.otpExpiry = otpExpiry; }

    public LocalDateTime getLastOtpRequestedAt() { return lastOtpRequestedAt; }
    public void setLastOtpRequestedAt(LocalDateTime lastOtpRequestedAt) { this.lastOtpRequestedAt = lastOtpRequestedAt; }

    public Integer getOtpAttemptCount() { return otpAttemptCount == null ? 0 : otpAttemptCount; }
    public void setOtpAttemptCount(Integer otpAttemptCount) { this.otpAttemptCount = otpAttemptCount; }
}
