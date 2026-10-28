package com.fitness_journal.springboot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateWorkoutRequest(

        @NotBlank(message = "Workout name is required")
        @Size(max = 100, message = "Name must be 100 characters or less")
        String name,

        @NotNull(message = "Date is required")
        @PastOrPresent(message = "Date cannot be in the future")
        LocalDate date,

        Integer durationMinutes,  // optional

        String notes              // optional
) {}