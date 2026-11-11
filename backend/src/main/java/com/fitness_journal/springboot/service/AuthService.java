package com.fitness_journal.springboot.service;

import com.fitness_journal.springboot.dto.request.LoginRequest;
import com.fitness_journal.springboot.dto.request.RegisterRequest;
import com.fitness_journal.springboot.dto.response.AuthResponse;
import com.fitness_journal.springboot.entity.User;
import com.fitness_journal.springboot.exception.ConflictException;
import com.fitness_journal.springboot.exception.ResourceNotFoundException;
import com.fitness_journal.springboot.repository.UserRepository;
import com.fitness_journal.springboot.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim();
        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email already in use");
        }

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(request.password()))
                .displayName(request.displayName().trim())
                .build();

        try {
            userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException("Email already in use");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getDisplayName()
        );
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResourceNotFoundException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getDisplayName()
        );
    }
}