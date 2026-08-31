package com.healthapp.doctor_booking.dto;

public record LabPackageDTO(
    Long id,
    String name,
    int testCount,
    double price,
    Double originalPrice,
    String description,
    boolean fastingRequired,
    String detailsJson,
    String categoryTags
) {}