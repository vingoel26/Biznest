package com.biznest.backend.service;

import com.biznest.backend.model.BusinessListing;
import com.biznest.backend.model.Category;
import com.biznest.backend.model.UserEntity;
import com.biznest.backend.repository.BusinessListingRepository;
import com.biznest.backend.repository.CategoryRepository;
import com.biznest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

import java.util.List;
import java.util.Optional;

@Service
public class BusinessListingService {
    @Autowired
    private BusinessListingRepository businessListingRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private UserRepository userRepository;

    public BusinessListing createListing(BusinessListing listing, Long categoryId, Long ownerId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found"));
        UserEntity owner = userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("User not found"));
        listing.setCategory(category);
        listing.setOwner(owner);
        return businessListingRepository.save(listing);
    }

    public Optional<BusinessListing> getListing(Long id) {
        return businessListingRepository.findById(id);
    }

    public Page<BusinessListing> getAllListings(Pageable pageable) {
        return businessListingRepository.findAll(pageable);
    }

    public BusinessListing updateListing(Long id, BusinessListing updated, Long categoryId, Long ownerId) {
        return businessListingRepository.findById(id)
            .map(existing -> {
                existing.setName(updated.getName());
                existing.setCategory(categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found")));
                existing.setOwner(userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("User not found")));
                existing.setLocation(updated.getLocation());
                existing.setStatus(updated.getStatus());
                existing.setDescription(updated.getDescription());
                existing.setAddress(updated.getAddress());
                existing.setPhone(updated.getPhone());
                existing.setBusinessHours(updated.getBusinessHours());
                existing.setRating(updated.getRating());
                existing.setImageUrl(updated.getImageUrl());
                if (updated.getImageData() != null) {
                    existing.setImageData(updated.getImageData());
                    existing.setImageType(updated.getImageType());
                }
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

    public Page<BusinessListing> filterByCategory(Long categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found"));
        return businessListingRepository.findByCategory(category, pageable);
    }

    public Page<BusinessListing> filterByLocation(String location, Pageable pageable) {
        return businessListingRepository.findByLocationContainingIgnoreCase(location, pageable);
    }

    public Page<BusinessListing> filterByOwner(Long ownerId, Pageable pageable) {
        UserEntity owner = userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("User not found"));
        return businessListingRepository.findByOwner(owner, pageable);
    }

    public List<BusinessListing> getAllByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found"));
        return businessListingRepository.findByCategory(category);
    }

    public List<BusinessListing> getAllByOwner(Long ownerId) {
        UserEntity owner = userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("User not found"));
        return businessListingRepository.findByOwner(owner);
    }

    public void saveListingImage(Long id, MultipartFile file) throws IOException {
        BusinessListing listing = getListing(id).orElseThrow(() -> new RuntimeException("Listing not found"));
        listing.setImageData(file.getBytes());
        listing.setImageType(file.getContentType());
        businessListingRepository.save(listing);
    }
} 