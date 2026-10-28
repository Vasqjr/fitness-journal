package com.fitness_journal.springboot.dto.request;

import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

// All fields optional — only update what's provided
public record UpdateWorkoutRequest(

        @Size(max = 100, message = "Name must be 100 characters or less")
        String name,

        @PastOrPresent(message = "Date cannot be in the future")
        LocalDate date,

        Integer durationMinutes,

        String notes
) {}