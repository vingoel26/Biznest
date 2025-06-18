package com.biznest.backend.service;

import com.biznest.backend.model.UserEntity;
import com.biznest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User Not Found with username: " + username);
        }

        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }

    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public void addUser(UserEntity user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists: " + user.getUsername());
        }

        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public UserEntity getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public UserEntity updateUserProfile(String username, Map<String, Object> updates) {
        UserEntity user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        if (updates.containsKey("displayName")) user.setDisplayName((String) updates.get("displayName"));
        if (updates.containsKey("bio")) user.setBio((String) updates.get("bio"));
        if (updates.containsKey("location")) user.setLocation((String) updates.get("location"));
        if (updates.containsKey("website")) user.setWebsite((String) updates.get("website"));
        if (updates.containsKey("profilePicture")) user.setProfilePicture((String) updates.get("profilePicture"));
        if (updates.containsKey("email")) user.setEmail((String) updates.get("email"));

        // Add `updatedAt` field if you want, or handle timestamp at DB level
        userRepository.save(user);
        return user;
    }

    public UserEntity updateUserRoles(String username, Set<String> roles) {
        // Prevent removing admin from the default creator
        if ("BIZNEST.CREATOR".equals(username) && (roles == null || !roles.contains("ROLE_ADMIN"))) {
            throw new IllegalArgumentException("Cannot remove admin role from the default creator user.");
        }
        UserEntity user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        user.setRoles(roles);
        userRepository.save(user);
        return user;
    }

    public boolean deleteUser(String username) {
        // Prevent deleting the default creator user
        if ("BIZNEST.CREATOR".equals(username)) {
            return false;
        }
        UserEntity user = userRepository.findByUsername(username);
        if (user == null || user.getRoles().contains("ROLE_ADMIN")) {
            return false;
        }

        userRepository.delete(user);
        return true;
    }

    public boolean updatePassword(String username, String currentPassword, String newPassword) {
        UserEntity user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }
}
