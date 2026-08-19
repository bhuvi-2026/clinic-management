package com.healthapp.doctor_booking.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_bookings", indexes = {
    @Index(name = "idx_patient_phone", columnList = "patientPhone")
})
public class LabBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("patientName")
    @JsonAlias({"name", "patient_name", "patients"})
    private String patientName;

    @Column(nullable = false)
    @JsonProperty("packageName")
    @JsonAlias({"package", "package_name"})
    private String packageName;

    @Column(nullable = false)
    private String schedule;

    private String email;

    @Column(length = 500)
    private String address;

    private int patientCount = 1;

    private boolean hardcopy;

    @Column(nullable = false)
    @JsonProperty("patientPhone")
    @JsonAlias({"phone", "mobile", "patient_phone"})
    private String patientPhone;

    @Column(nullable = false)
    private String status = "CONFIRMED";

    @Column(columnDefinition = "TEXT")
    private String reportData;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime bookedAt;

    public LabBooking() {}

    @PrePersist
    public void prePersist() {
        if (this.bookedAt == null) {
            this.bookedAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

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

    public String getReportData() { return reportData; }
    public void setReportData(String reportData) { this.reportData = reportData; }

    public LocalDateTime getBookedAt() { return bookedAt; }
    public void setBookedAt(LocalDateTime bookedAt) { this.bookedAt = bookedAt; }
}