package com.biznest.backend.controller;

import com.biznest.backend.model.BusinessListing;
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
    public ResponseEntity<BusinessListing> createListing(@RequestBody BusinessListing listing) {
        return ResponseEntity.ok(businessListingService.createListing(listing));
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
    public ResponseEntity<BusinessListing> updateListing(@PathVariable Long id, @RequestBody BusinessListing updated) {
        return ResponseEntity.ok(businessListingService.updateListing(id, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable Long id) {
        businessListingService.deleteListing(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BusinessListing>> searchListings(
            @RequestParam(defaultValue = "") String name,
            @RequestParam(defaultValue = "") String category,
            @RequestParam(defaultValue = "") String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(businessListingService.searchAndFilter(name, category, location, pageable));
    }

    @GetMapping("/by-category")
    public ResponseEntity<List<BusinessListing>> getListingsByCategory(@RequestParam String category) {
        return ResponseEntity.ok(businessListingService.getAllByCategory(category));
    }
} 