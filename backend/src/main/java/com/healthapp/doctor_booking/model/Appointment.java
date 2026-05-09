package com.healthapp.doctor_booking.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;
    private String patientPhone;
    private String appointmentSlot;
    private LocalDateTime bookingTime = LocalDateTime.now();
    private String userEmail;
    private String status;

    @Column(columnDefinition = "TEXT")
    private String zoomJoinUrl;

    @Column(columnDefinition = "TEXT")
    private String zoomStartUrl;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientPhone() {
        return patientPhone;
    }

    public void setPatientPhone(String patientPhone) {
        this.patientPhone = patientPhone;
    }

    public String getAppointmentSlot() {
        return appointmentSlot;
    }

    public void setAppointmentSlot(String appointmentSlot) {
        this.appointmentSlot = appointmentSlot;
    }

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(LocalDateTime bookingTime) {
        this.bookingTime = bookingTime;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getZoomJoinUrl() {
        return zoomJoinUrl;
    }

    public void setZoomJoinUrl(String zoomJoinUrl) {
        this.zoomJoinUrl = zoomJoinUrl;
    }

    public String getZoomStartUrl() {
        return zoomStartUrl;
    }

    public void setZoomStartUrl(String zoomStartUrl) {
        this.zoomStartUrl = zoomStartUrl;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }
}