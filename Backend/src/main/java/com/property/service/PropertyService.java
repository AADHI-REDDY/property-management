package com.property.service;

import com.property.dto.PropertyRequest;
import com.property.dto.PropertyResponse;
import com.property.model.Property;
import com.property.model.PropertyImage;
import com.property.model.User;
import com.property.repository.PropertyImageRepository;
import com.property.repository.PropertyRepository;
import com.property.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final FileStorageService fileStorageService;

    public PropertyService(PropertyRepository propertyRepository,
                           UserRepository userRepository,
                           PropertyImageRepository propertyImageRepository,
                           FileStorageService fileStorageService) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.fileStorageService = fileStorageService;
    }

    public List<PropertyResponse> getAllProperties() {
        return propertyRepository.findAll().stream()
                .map(PropertyResponse::fromProperty)
                .collect(Collectors.toList());
    }

    public PropertyResponse getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        return PropertyResponse.fromProperty(property);
    }

    public List<PropertyResponse> getPropertiesByLandlord(Long landlordId) {
        return propertyRepository.findByLandlordId(landlordId).stream()
                .map(PropertyResponse::fromProperty)
                .collect(Collectors.toList());
    }

    public List<PropertyResponse> getAvailableProperties() {
        return propertyRepository.findByStatus(Property.Status.AVAILABLE).stream()
                .map(PropertyResponse::fromProperty)
                .collect(Collectors.toList());
    }

    public PropertyResponse createProperty(PropertyRequest request, String landlordEmail) {
        User landlord = userRepository.findByEmail(landlordEmail)
                .orElseThrow(() -> new RuntimeException("Landlord not found"));

        boolean isLandlord = landlord.getRoles().stream()
                .anyMatch(role -> role.getName().equals("ROLE_LANDLORD"));
        if (!isLandlord) {
            throw new RuntimeException("Only landlords can create properties");
        }

        Property property = Property.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .rent(request.getRent())
                .deposit(request.getDeposit())
                .bedrooms(request.getBedrooms())
                .bathrooms(request.getBathrooms())
                .squareFeet(request.getSquareFeet())
                .amenities(request.getAmenities())
                // --- THIS IS THE FIX ---
                // REMOVE this line. Images are uploaded separately.
                // .images(request.getImages()) 
                // --- END FIX ---
                .status(Property.Status.AVAILABLE)
                .landlord(landlord)
                .build();

        Property savedProperty = propertyRepository.save(property);
        return PropertyResponse.fromProperty(savedProperty);
    }

    public PropertyResponse updateProperty(Long id, PropertyRequest request, String landlordEmail) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        User landlord = userRepository.findByEmail(landlordEmail)
                .orElseThrow(() -> new RuntimeException("Landlord not found"));

        if (!property.getLandlord().getId().equals(landlord.getId())) {
            throw new RuntimeException("You can only update your own properties");
        }

        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setAddress(request.getAddress());
        property.setCity(request.getCity());
        property.setState(request.getState());
        property.setZipCode(request.getZipCode());
        property.setRent(request.getRent());
        property.setDeposit(request.getDeposit());
        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setSquareFeet(request.getSquareFeet());
        property.setAmenities(request.getAmenities());
        
        // --- THIS IS THE FIX ---
        // REMOVE this line. Images are managed via the uploadImages endpoint.
        // property.setImages(request.getImages());
        // --- END FIX ---

        Property savedProperty = propertyRepository.save(property);
        return PropertyResponse.fromProperty(savedProperty);
    }

    public void deleteProperty(Long id, String landlordEmail) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        User landlord = userRepository.findByEmail(landlordEmail)
                .orElseThrow(() -> new RuntimeException("Landlord not found"));

        if (!property.getLandlord().getId().equals(landlord.getId())) {
            throw new RuntimeException("You can only delete your own properties");
        }
        
        // TODO: Add logic here to delete images from file system using FileStorageService
        
        propertyRepository.delete(property);
    }

    @Transactional
    public List<String> uploadImages(Long propertyId, MultipartFile[] files, String userEmail) throws IOException {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        User landlord = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Landlord not found"));

        if (!property.getLandlord().getId().equals(landlord.getId())) {
            throw new RuntimeException("You can only upload images to your own properties");
        }

        List<String> savedImageUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            String subDirectory = "properties/" + property.getId();
            String imageUrl = fileStorageService.storeFile(file, subDirectory);

            PropertyImage propertyImage = new PropertyImage(imageUrl, property);
            propertyImageRepository.save(propertyImage);
            
            savedImageUrls.add(imageUrl);
        }
        
        return savedImageUrls;
    }
}