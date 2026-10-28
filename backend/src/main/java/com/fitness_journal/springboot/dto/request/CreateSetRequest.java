package com.fitness_journal.springboot.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateSetRequest(

        @NotNull(message = "Exercise ID is required")
        UUID exerciseId,

        @NotNull(message = "Set number is required")
        @Min(value = 1, message = "Set number must be at least 1")
        Integer setNumber,

        @Min(value = 0, message = "Reps cannot be negative")
        Integer reps,           // optional (some sets are time-based)

        BigDecimal weightKg,    // optional (bodyweight exercises)

        BigDecimal rpe,         // optional (rate of perceived exertion 1-10)

        String notes            // optional
) {}