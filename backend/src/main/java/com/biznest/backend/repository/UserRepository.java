package com.biznest.backend.repository;

import com.biznest.backend.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByUsername(String username);
    UserEntity findByUsername(String username);
    UserEntity findByEmail(String email);
    UserEntity findByUsernameAndEmail(String username, String email);
    java.util.List<UserEntity> findAllByEmail(String email);
}
