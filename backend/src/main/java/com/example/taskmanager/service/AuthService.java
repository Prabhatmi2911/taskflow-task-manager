package com.example.taskmanager.service;

import com.example.taskmanager.dto.AuthDto;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service handling authentication logic — login, register, JWT token generation.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    /**
     * Authenticates a user with username and password.
     */
    public AuthDto.LoginResponse login(AuthDto.LoginRequest loginRequest) {
        logger.debug("Login attempt for user: {}", loginRequest.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtUtils.generateToken(userDetails);

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow();

        logger.info("User '{}' logged in successfully", user.getUsername());

        return AuthDto.LoginResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .message("Login successful")
                .build();
    }

    /**
     * Registers a new user account.
     * Validates that username and email are not already taken.
     * On success, auto-logs in and returns a JWT token.
     */
    @Transactional
    public AuthDto.LoginResponse register(AuthDto.RegisterRequest request) {
        logger.debug("Register attempt for username: {}", request.getUsername());

        // Check username uniqueness
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken");
        }

        // Check email uniqueness
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("An account with email '" + request.getEmail() + "' already exists");
        }

        // Create and save new user
        User newUser = User.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(newUser);
        logger.info("New user registered: '{}'", newUser.getUsername());

        // Auto-login: generate token immediately after registration
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(newUser.getUsername())
                .password(newUser.getPassword())
                .authorities("ROLE_USER")
                .build();

        String token = jwtUtils.generateToken(userDetails);

        return AuthDto.LoginResponse.builder()
                .token(token)
                .username(newUser.getUsername())
                .email(newUser.getEmail())
                .message("Account created successfully! Welcome, " + newUser.getUsername() + "!")
                .build();
    }
}