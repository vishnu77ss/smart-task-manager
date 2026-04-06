package com.taskmanager.service;

import com.taskmanager.dto.Dtos;
import com.taskmanager.entity.User;
import com.taskmanager.exception.DuplicateResourceException;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final UserDetailsService userDetailsService;

    public Dtos.AuthResponse register(Dtos.RegisterRequest request) {
        // Check if email is already taken
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        // Create and save new user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);

        // Generate token for immediate login
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return Dtos.AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .message("Registration successful")
                .build();
    }

    public Dtos.AuthResponse login(Dtos.LoginRequest request) {
        // Authenticate credentials (throws BadCredentialsException if wrong)
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Load user and generate token
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return Dtos.AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .message("Login successful")
                .build();
    }
}
