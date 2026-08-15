package com.healthapp.doctor_booking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lab_bookings", indexes = {
    @Index(name = "idx_patient_phone", columnList = "patientPhone")
})
public class LabBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String packageName;

    @Column(nullable = false)
    private String schedule;

    private String email;

    @Column(length = 500)
    private String address;

    private int patientCount;

    private boolean hardcopy;

    @Column(nullable = false)
    private String patientPhone;

    @Column(nullable = false)
    private String status = "CONFIRMED"; // default status

    public LabBooking() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }

    public String getSchedule() { return schedule; }
    public void setSchedule(String schedule) { this.schedule = schedule; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public int getPatientCount() { return patientCount; }
    public void setPatientCount(int patientCount) { this.patientCount = patientCount; }

    public boolean isHardcopy() { return hardcopy; }
    public void setHardcopy(boolean hardcopy) { this.hardcopy = hardcopy; }

    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
