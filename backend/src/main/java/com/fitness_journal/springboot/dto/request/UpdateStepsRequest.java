package com.fitness_journal.springboot.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateStepsRequest(
        @NotNull @Min(0) @Max(200_000) Integer steps
) {
}