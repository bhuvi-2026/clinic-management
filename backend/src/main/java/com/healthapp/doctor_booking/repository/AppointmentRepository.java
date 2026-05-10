package com.healthapp.doctor_booking.repository;

import com.healthapp.doctor_booking.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // This allows the dashboard to fetch appointments for a specific user
    List<Appointment> findByUserMobileOrderByBookingTimeDesc(String userMobile);
}