package com.fitness_journal.springboot.dto.response;

import com.fitness_journal.springboot.entity.MuscleGroup;

import java.util.UUID;

public record ExerciseResponse(
        UUID id,
        String name,
        MuscleGroup muscleGroup,
        String description,
        boolean isCustom
) {}