package com.biznest.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String username;

    public JwtResponse(String accessToken, String username) {
        this.token = accessToken;
        this.username = username;
    }

} 