package com.fitness_journal.springboot.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record WorkoutResponse(
        UUID id,
        String name,
        LocalDate date,
        Integer durationMinutes,
        String notes,
        LocalDateTime createdAt,
        List<SetResponse> sets   // nested — one request gets you everything
) {}