package com.healthapp.doctor_booking.service;

import com.healthapp.doctor_booking.dto.LabPackageDTO;
import com.healthapp.doctor_booking.model.HomeBasicPackage;
import com.healthapp.doctor_booking.model.LabBooking;
import com.healthapp.doctor_booking.model.LabBookingRequest;
import com.healthapp.doctor_booking.model.LabPackage;
import com.healthapp.doctor_booking.repository.HomeBasicPackageRepository;
import com.healthapp.doctor_booking.repository.LabBookingRepository;
import com.healthapp.doctor_booking.repository.LabPackageRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LabService {

    private final LabPackageRepository labPackageRepository;
    private final HomeBasicPackageRepository homeBasicPackageRepository;
    private final LabBookingRepository labBookingRepository;

    public LabService(LabPackageRepository labPackageRepository,
                      HomeBasicPackageRepository homeBasicPackageRepository,
                      LabBookingRepository labBookingRepository) {
        this.labPackageRepository = labPackageRepository;
        this.homeBasicPackageRepository = homeBasicPackageRepository;
        this.labBookingRepository = labBookingRepository;
    }

    // =========================================================================
    // 1. LAB PACKAGES (CACHED & FILTERED)
    // =========================================================================
    @Cacheable(value = "labPackagesCache", key = "#category != null ? #category.trim().toLowerCase() : 'all'")
    @Transactional(readOnly = true)
    public List<LabPackageDTO> getPackagesByCategory(String category) {
        String queryCategory = (category != null && !category.trim().isEmpty()) ? category.trim() : "ALL";
        return labPackageRepository.findByCategoryTagFiltered(queryCategory)
                .stream()
                .map(p -> new LabPackageDTO(
                        p.getId(),
                        p.getName(),
                        p.getTestCount(),
                        p.getPrice(),
                        p.getOriginalPrice(),
                        p.getDescription(),
                        p.isFastingRequired(),
                        p.getDetailsJson(),
                        p.getCategoryTags()
                ))
                .collect(Collectors.toList());
    }

    public List<LabPackage> getAllPackages() {
        return labPackageRepository.findAll();
    }

    @CacheEvict(value = "labPackagesCache", allEntries = true)
    public LabPackage savePackage(LabPackage labPackage) {
        return labPackageRepository.save(labPackage);
    }

    // =========================================================================
    // 2. HOME BASIC PACKAGES (RESOLVES CONTROLLER ERRORS)
    // =========================================================================
    @Transactional(readOnly = true)
    public List<HomeBasicPackage> getAllHomeBasicPackages() {
        return homeBasicPackageRepository.findAllByOrderByIdAsc();
    }

    @Transactional
    public HomeBasicPackage saveHomeBasicPackage(HomeBasicPackage homeBasicPackage) {
        return homeBasicPackageRepository.save(homeBasicPackage);
    }

    // =========================================================================
    // 3. BOOKING & REPORTS
    // =========================================================================
    @Transactional
    public LabBooking bookTest(LabBookingRequest request) {
        Optional<LabBooking> existing = labBookingRepository.findByPatientPhoneAndPackageNameAndSchedule(
                request.getPatientPhone(), request.getPackageName(), request.getSchedule());

        if (existing.isPresent()) {
            LabBooking existingBooking = existing.get();
            if (request.getPatientName() != null && !request.getPatientName().trim().isEmpty()) {
                existingBooking.setPatientName(request.getPatientName().trim());
                return labBookingRepository.save(existingBooking);
            }
            return existingBooking;
        }

        LabBooking booking = new LabBooking();
        booking.setPatientName(request.getPatientName() != null && !request.getPatientName().trim().isEmpty() 
            ? request.getPatientName().trim() 
            : "Valued Patient");
        booking.setPackageName(request.getPackageName());
        booking.setSchedule(request.getSchedule());
        booking.setEmail(request.getEmail());
        booking.setAddress(request.getAddress());
        booking.setPatientCount(request.getPatientCount() > 0 ? request.getPatientCount() : 1);
        booking.setHardcopy(request.isHardcopy());
        booking.setPatientPhone(request.getPatientPhone());
        booking.setStatus("CONFIRMED");
        booking.setBookedAt(LocalDateTime.now());

        return labBookingRepository.save(booking);
    }

    public List<LabBooking> getBookingsByMobile(String mobile) {
        return labBookingRepository.findByPatientPhoneOrderByScheduleDesc(mobile);
    }

    public List<LabBooking> getAllBookings() {
        return labBookingRepository.findAllByOrderByIdDesc();
    }

    @Transactional
    public LabBooking completeBooking(Long bookingId, String reportJson) {
        LabBooking booking = labBookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + bookingId));
        booking.setStatus("COMPLETED");
        if (reportJson != null && !reportJson.trim().isEmpty()) {
            booking.setReportData(reportJson);
        }
        return labBookingRepository.save(booking);
    }
}