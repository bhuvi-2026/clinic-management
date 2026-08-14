package com.healthapp.doctor_booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.healthapp.doctor_booking.model.HomeBasicPkg;

@Repository
public interface HomeBasicPkgRepository extends JpaRepository<HomeBasicPkg, Long> {
}