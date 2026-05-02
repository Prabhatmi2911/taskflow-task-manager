package com.example.taskmanager.config;

import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Data initializer that seeds the database with a default demo user on application startup.
 * Only runs if the default user does not already exist.
 *
 * Default credentials:
 *   username: admin
 *   password: admin123
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedDefaultUser();
    }

    private void seedDefaultUser() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@taskmanager.com")
                    .password(passwordEncoder.encode("admin123"))
                    .build();

            userRepository.save(admin);
            logger.info("✅ Default user created — username: admin, password: admin123");
        } else {
            logger.info("ℹ️  Default user already exists, skipping seed.");
        }
    }
}