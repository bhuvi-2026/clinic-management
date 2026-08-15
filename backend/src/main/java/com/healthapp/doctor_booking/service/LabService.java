package com.healthapp.doctor_booking.service;

import com.healthapp.doctor_booking.model.LabBooking;
import com.healthapp.doctor_booking.model.LabBookingRequest;
import com.healthapp.doctor_booking.model.LabPackage;
import com.healthapp.doctor_booking.repository.LabBookingRepository;
import com.healthapp.doctor_booking.repository.LabPackageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class LabService {

    private final LabPackageRepository labPackageRepository;
    private final LabBookingRepository labBookingRepository;

    public LabService(LabPackageRepository labPackageRepository, LabBookingRepository labBookingRepository) {
        this.labPackageRepository = labPackageRepository;
        this.labBookingRepository = labBookingRepository;
    }

    public List<LabPackage> getAllPackages() {
        return labPackageRepository.findAll();
    }

    public LabPackage savePackage(LabPackage labPackage) {
        return labPackageRepository.save(labPackage);
    }

    @Transactional
    public LabBooking bookTest(LabBookingRequest request) {
        // Idempotency: Prevent duplicate bookings by checking phone, package, and schedule
        Optional<LabBooking> existing = labBookingRepository.findByPatientPhoneAndPackageNameAndSchedule(
                request.getPatientPhone(),
                request.getPackageName(),
                request.getSchedule()
        );

        if (existing.isPresent()) {
            return existing.get(); // Return already created booking (idempotent success)
        }

        LabBooking booking = new LabBooking();
        booking.setPackageName(request.getPackageName());
        booking.setSchedule(request.getSchedule());
        booking.setEmail(request.getEmail());
        booking.setAddress(request.getAddress());
        booking.setPatientCount(request.getPatientCount());
        booking.setHardcopy(request.isHardcopy());
        booking.setPatientPhone(request.getPatientPhone());
        booking.setStatus("CONFIRMED");

        return labBookingRepository.save(booking);
    }

    public List<LabBooking> getBookingsByMobile(String mobile) {
        return labBookingRepository.findByPatientPhoneOrderByScheduleDesc(mobile);
    }

    @Transactional
    public LabBooking completeBooking(Long bookingId) {
        LabBooking booking = labBookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + bookingId));
        
        booking.setStatus("COMPLETED");
        return labBookingRepository.save(booking);
    }
}
