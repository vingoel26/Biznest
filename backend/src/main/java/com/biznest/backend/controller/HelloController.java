package com.biznest.backend.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
// @RequestMapping("/api") // Comment out or remove this line
public class HelloController {

    @GetMapping("/api/hello") // Change this line to use the full path
    public String sayHello() {
        System.out.println("--- sayHello() method was called! ---");
        return "Hello from Spring Boot Backend!";
    }
} 