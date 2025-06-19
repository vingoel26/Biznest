package com.biznest.backend.controller;

import com.biznest.backend.model.BusinessListing;
import com.biznest.backend.model.Category;
import com.biznest.backend.model.UserEntity;
import com.biznest.backend.service.BusinessListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
} 