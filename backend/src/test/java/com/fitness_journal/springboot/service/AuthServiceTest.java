package com.fitness_journal.springboot.service;

import com.fitness_journal.springboot.dto.request.RegisterRequest;
import com.fitness_journal.springboot.entity.User;
import com.fitness_journal.springboot.exception.ConflictException;
import com.fitness_journal.springboot.repository.UserRepository;
import com.fitness_journal.springboot.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final JwtUtil jwtUtil = mock(JwtUtil.class);
    private final AuthService authService = new AuthService(userRepository, passwordEncoder, jwtUtil);

    @Test
    void rejectsAnEmailThatIsAlreadyRegistered() {
        when(userRepository.existsByEmail("taken@example.com")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.register(
                new RegisterRequest("taken@example.com", "password123", "Runner")
        ));

        verify(userRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void mapsConcurrentDuplicateEmailInsertToConflict() {
        when(userRepository.existsByEmail("taken@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed-password");
        doThrow(new DataIntegrityViolationException("duplicate email"))
                .when(userRepository).saveAndFlush(org.mockito.ArgumentMatchers.any(User.class));

        assertThrows(ConflictException.class, () -> authService.register(
                new RegisterRequest("taken@example.com", "password123", "Runner")
        ));
    }
}