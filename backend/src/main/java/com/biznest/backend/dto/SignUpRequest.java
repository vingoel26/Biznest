package com.biznest.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    private String username;
    private String email;
    private String password;
    
    // Optional profile fields
    private String displayName;
    private String bio;
    private String location;
    private String website;
    private String profilePicture;
}
