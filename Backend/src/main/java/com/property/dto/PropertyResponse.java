package com.property.dto;

import com.property.model.Property;
import com.property.model.PropertyImage;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList; // <-- IMPORT THIS
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class PropertyResponse {
    private Long id;
    private String title;
    private String description;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private BigDecimal rent;
    private BigDecimal deposit;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer squareFeet;
    private List<String> amenities;
    private List<String> images; // This expects a List<String>
    private String status;
    private Long landlordId;
    private String landlordName;
    private LocalDateTime createdAt;

    public static PropertyResponse fromProperty(Property property) {
        if (property == null) {
            return null;
        }

        // --- THIS IS THE FIX ---
        List<String> imageUrls = new ArrayList<>(); // 1. Initialize an empty list
        List<PropertyImage> imageEntities = property.getImages(); // 2. Get the list
        
        // 3. Check if the list is not null before streaming
        if (imageEntities != null) { 
            imageUrls = imageEntities.stream()
                                     .map(PropertyImage::getImageUrl)
                                     .collect(Collectors.toList());
        }
        // --- END FIX ---

        return PropertyResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .address(property.getAddress())
                .city(property.getCity())
                .state(property.getState())
                .zipCode(property.getZipCode())
                .rent(property.getRent())
                .deposit(property.getDeposit())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .squareFeet(property.getSquareFeet())
                .amenities(property.getAmenities())
                .images(imageUrls) // <-- Pass the new, safe list of strings
                .status(property.getStatus().name().toLowerCase())
                .landlordId(property.getLandlord().getId())
                .landlordName(property.getLandlord().getName())
                .createdAt(property.getCreatedAt())
                .build();
    }
}