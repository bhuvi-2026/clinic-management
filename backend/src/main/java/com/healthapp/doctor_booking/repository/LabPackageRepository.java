package com.healthapp.doctor_booking.repository;

import com.healthapp.doctor_booking.model.LabPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabPackageRepository extends JpaRepository<LabPackage, Long> {

    @Query("SELECT p FROM LabPackage p WHERE " +
           "(:category IS NULL OR :category = '' OR :category = 'ALL' OR " +
           "CONCAT(',', LOWER(p.categoryTags), ',') LIKE CONCAT('%,', LOWER(:category), ',%')) " +
           "ORDER BY p.price ASC")
    List<LabPackage> findByCategoryTagFiltered(@Param("category") String category);
}