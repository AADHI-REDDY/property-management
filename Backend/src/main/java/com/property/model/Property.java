package com.property.model; // Or your correct package

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*; // Import all
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "properties")
@Getter
@Setter
@Builder // Keep this
@NoArgsConstructor // Keep this
@AllArgsConstructor // Keep this
public class Property {

    // --- This is your Status Enum (if it's inside the class) ---
    public enum Status {
        AVAILABLE,
        RENTED,
        MAINTENANCE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String address;
    @Column(nullable = false)
    private String city;
    @Column(nullable = false)
    private String state;
    @Column(nullable = false)
    private String zipCode;

    @Column(nullable = false)
    private BigDecimal rent;

    @Column(nullable = false)
    private BigDecimal deposit;

    @Column(nullable = false)
    private Integer bedrooms;
    
    @Column(nullable = false)
    private Integer bathrooms;

    private Integer squareFeet;

    @ElementCollection // Assuming amenities is a simple list of strings
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity")
    private List<String> amenities = new ArrayList<>(); // Initialize

    // --- THIS IS THE FIX ---
    @OneToMany(
        mappedBy = "property",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY // Eager-fetching lists can be slow
    )
    @Builder.Default // <-- ADD THIS ANNOTATION
    private List<PropertyImage> images = new ArrayList<>();
    // --- END FIX ---

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    @JsonIgnore
    private User landlord;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}