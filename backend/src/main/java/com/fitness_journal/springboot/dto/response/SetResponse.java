package com.fitness_journal.springboot.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record SetResponse(
        UUID id,
        UUID exerciseId,
        String exerciseName,    // flattened so frontend doesn't need a second request
        Integer setNumber,
        Integer reps,
        BigDecimal weightKg,
        BigDecimal rpe,
        String notes
) {}