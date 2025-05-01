package com.biznest.backend.dto;

// Using Lombok for boilerplate code reduction (getters, setters, constructors)
// Make sure Lombok dependency is added to pom.xml if not already present
// (It's usually included by default with web starter)
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
} 