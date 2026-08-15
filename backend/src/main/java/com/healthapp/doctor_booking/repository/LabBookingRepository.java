package com.healthapp.doctor_booking.repository;

import com.healthapp.doctor_booking.model.LabBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LabBookingRepository extends JpaRepository<LabBooking, Long> {
    List<LabBooking> findByPatientPhoneOrderByScheduleDesc(String patientPhone);
    
    // For duplicate prevention
    Optional<LabBooking> findByPatientPhoneAndPackageNameAndSchedule(String patientPhone, String packageName, String schedule);
}
