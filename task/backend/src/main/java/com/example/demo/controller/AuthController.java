package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.config.JwtUtils;
import com.example.demo.dto.AuthResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    // ✅ REGISTER
    @PostMapping("/register")
    public AuthResponse register(@RequestBody User user) {
        User savedUser = userRepository.save(user);
        String token = jwtUtils.generateToken(savedUser.getEmail());
        return new AuthResponse(token, savedUser);
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public AuthResponse login(@RequestBody User user) {
        User foundUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // In a real app, we would verify the password here. 
        // Since we are using NoOpPasswordEncoder, we'll just check equality if needed or assume it's handled by SecurityConfig during login (if we used standard login).
        // But for this custom endpoint:
        if (!foundUser.getPassword().equals(user.getPassword())) {
             throw new RuntimeException("Invalid password");
        }

        String token = jwtUtils.generateToken(foundUser.getEmail());
        return new AuthResponse(token, foundUser);
    }
}
