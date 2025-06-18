package com.biznest.backend.service;

import com.biznest.backend.model.Category;
import com.biznest.backend.repository.CategoryRepository;
import com.biznest.backend.repository.BusinessListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private BusinessListingRepository businessListingRepository;

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategory(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public Category updateCategory(Long id, Category updated) {
        return categoryRepository.findById(id)
            .map(existing -> {
                existing.setName(updated.getName());
                existing.setDescription(updated.getDescription());
                return categoryRepository.save(existing);
            })
            .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    // Category statistics: listings per category
    public Map<String, Long> getCategoryStats() {
        return businessListingRepository.findAll().stream()
            .collect(Collectors.groupingBy(
                listing -> listing.getCategory(),
                Collectors.counting()
            ));
    }
} 