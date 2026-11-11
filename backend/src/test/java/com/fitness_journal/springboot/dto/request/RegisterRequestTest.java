package com.fitness_journal.springboot.dto.request;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ConstraintViolation;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertTrue;

class RegisterRequestTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void acceptsRegistrationDetailsAtTheMinimumAndMaximumLimits() {
        RegisterRequest request = new RegisterRequest(
                "runner@example.com",
                "12345678",
                "R".repeat(100)
        );

        assertTrue(validator.validate(request).isEmpty());
    }

    @Test
    void rejectsBlankInvalidAndOversizedRegistrationDetails() {
        RegisterRequest request = new RegisterRequest(
                "invalid-email-" + "x".repeat(250),
                "short",
                "R".repeat(101)
        );

        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);

        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")
                && v.getMessage().equals("Email must be 254 characters or less")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")
                && v.getMessage().equals("Password must be at least 8 characters")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("displayName")
                && v.getMessage().equals("Display name must be 100 characters or less")));
    }
}