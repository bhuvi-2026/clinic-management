package com.healthapp.doctor_booking.repository;

import com.healthapp.doctor_booking.model.HomeBasicPackage;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HomeBasicPackageRepository extends JpaRepository<HomeBasicPackage, Long> {

    List<HomeBasicPackage> findAllByOrderByIdAsc();
}