package com.fitness_journal.springboot.dto.response;

import java.time.LocalDate;
import java.util.UUID;

public record StepEntryResponse(
        UUID id,
        LocalDate date,
        int steps
) {
}