package com.healthapp.doctor_booking.model; // Use your actual package path

public class LabBookingRequest {
    private String packageName;
    private String schedule;
    private String email;
    private String address;
    private int patientCount;
    private boolean hardcopy;

    // Getters and Setters are REQUIRED for Spring to map the JSON
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
}