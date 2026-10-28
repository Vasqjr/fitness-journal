package com.fitness_journal.springboot.dto.request;

import jakarta.validation.constraints.Min;

import java.math.BigDecimal;

public record UpdateSetRequest(

        @Min(value = 0, message = "Reps cannot be negative")
        Integer reps,

        BigDecimal weightKg,

        BigDecimal rpe,

        String notes
) {}