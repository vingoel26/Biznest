package com.biznest.backend.service;

import com.biznest.backend.model.BusinessListing;
import com.biznest.backend.repository.BusinessListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BusinessListingService {
    @Autowired
    private BusinessListingRepository businessListingRepository;

    public BusinessListing createListing(BusinessListing listing) {
        return businessListingRepository.save(listing);
    }

    public Optional<BusinessListing> getListing(Long id) {
        return businessListingRepository.findById(id);
    }

    public Page<BusinessListing> getAllListings(Pageable pageable) {
        return businessListingRepository.findAll(pageable);
    }

    public BusinessListing updateListing(Long id, BusinessListing updated) {
        return businessListingRepository.findById(id)
            .map(existing -> {
                existing.setName(updated.getName());
                existing.setCategory(updated.getCategory());
                existing.setLocation(updated.getLocation());
                existing.setStatus(updated.getStatus());
                existing.setDescription(updated.getDescription());
                existing.setAddress(updated.getAddress());
                existing.setPhone(updated.getPhone());
                existing.setBusinessHours(updated.getBusinessHours());
                existing.setRating(updated.getRating());
                existing.setImageUrl(updated.getImageUrl());
                return businessListingRepository.save(existing);
            })
            .orElseThrow(() -> new RuntimeException("Listing not found"));
    }

    public void deleteListing(Long id) {
        businessListingRepository.deleteById(id);
    }

    public Page<BusinessListing> searchByName(String name, Pageable pageable) {
        return businessListingRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    public Page<BusinessListing> filterByCategory(String category, Pageable pageable) {
        return businessListingRepository.findByCategoryContainingIgnoreCase(category, pageable);
    }

    public Page<BusinessListing> filterByLocation(String location, Pageable pageable) {
        return businessListingRepository.findByLocationContainingIgnoreCase(location, pageable);
    }

    public Page<BusinessListing> searchAndFilter(String name, String category, String location, Pageable pageable) {
        return businessListingRepository.findByNameContainingIgnoreCaseAndCategoryContainingIgnoreCaseAndLocationContainingIgnoreCase(
            name, category, location, pageable);
    }
} 