package com.fitness_journal.springboot.dto.request;

import com.fitness_journal.springboot.entity.MuscleGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateExerciseRequest(

        @NotBlank(message = "Exercise name is required")
        @Size(max = 100, message = "Name must be 100 characters or less")
        String name,

        @NotNull(message = "Muscle group is required")
        MuscleGroup muscleGroup,

        String description  // optional
) {}