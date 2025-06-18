package com.biznest.backend.repository;

import com.biznest.backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(String name);
    Category findByName(String name);
} 