package com.property.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    // Define the root upload directory
    private final Path fileStorageLocation;
    
    // --- THIS IS THE FIX ---
    // This 'uploads' string MUST match the WebConfig addResourceHandler
    private final String rootUploadsDir = "uploads"; 
    // --- END FIX ---

    public FileStorageService() {
        this.fileStorageLocation = Paths.get(rootUploadsDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file, String subDirectory) throws IOException {
        // Create the specific subdirectory (e.g., uploads/properties/1)
        Path targetLocation = this.fileStorageLocation.resolve(subDirectory).normalize();
        Files.createDirectories(targetLocation);

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Copy file to the target location
        Path targetPath = targetLocation.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // --- THIS IS THE FIX ---
        // Return the full, web-accessible path including /uploads/
        // This ensures the correct URL is saved to the database.
        return "/" + rootUploadsDir + "/" + subDirectory + "/" + uniqueFilename;
        // --- END FIX ---
    }
}