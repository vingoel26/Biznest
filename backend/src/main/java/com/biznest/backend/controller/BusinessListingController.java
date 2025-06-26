package com.biznest.backend.controller;

import com.biznest.backend.model.BusinessListing;
import com.biznest.backend.model.Category;
import com.biznest.backend.model.UserEntity;
import com.biznest.backend.service.BusinessListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/listings")
@CrossOrigin
public class BusinessListingController {
    @Autowired
    private BusinessListingService businessListingService;

    @PostMapping
    public ResponseEntity<BusinessListing> createListing(@RequestBody BusinessListing listing, @RequestParam Long categoryId, @RequestParam Long ownerId) {
        return ResponseEntity.ok(businessListingService.createListing(listing, categoryId, ownerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusinessListing> getListing(@PathVariable Long id) {
        Optional<BusinessListing> listing = businessListingService.getListing(id);
        return listing.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<Page<BusinessListing>> getAllListings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(businessListingService.getAllListings(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BusinessListing> updateListing(@PathVariable Long id, @RequestBody BusinessListing updated, @RequestParam Long categoryId, @RequestParam Long ownerId) {
        return ResponseEntity.ok(businessListingService.updateListing(id, updated, categoryId, ownerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        businessListingService.deleteListing(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-category")
    public ResponseEntity<List<BusinessListing>> getListingsByCategory(@RequestParam Long categoryId) {
        return ResponseEntity.ok(businessListingService.getAllByCategory(categoryId));
    }

    @GetMapping("/by-owner")
    public ResponseEntity<List<BusinessListing>> getListingsByOwner(@RequestParam Long ownerId) {
        return ResponseEntity.ok(businessListingService.getAllByOwner(ownerId));
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<?> uploadListingImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            businessListingService.saveListingImage(id, file);
            return ResponseEntity.ok().body("Image uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload image");
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getListingImage(@PathVariable Long id) {
        Optional<BusinessListing> listingOpt = businessListingService.getListing(id);
        if (listingOpt.isPresent() && listingOpt.get().getImageData() != null) {
            BusinessListing listing = listingOpt.get();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(listing.getImageType() != null ? listing.getImageType() : MediaType.IMAGE_JPEG_VALUE));
            return new ResponseEntity<>(listing.getImageData(), headers, 200);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 