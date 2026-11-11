package com.fitness_journal.springboot.service;

import com.fitness_journal.springboot.entity.Exercise;
import com.fitness_journal.springboot.entity.Workout;
import com.fitness_journal.springboot.entity.WorkoutSet;
import com.fitness_journal.springboot.repository.WorkoutSetRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ProgressServiceTest {

    private final WorkoutSetRepository workoutSetRepository = mock(WorkoutSetRepository.class);
    private final ProgressService progressService = new ProgressService(workoutSetRepository);

    @Test
    void includesFractionalWeightsInDailyVolume() {
        UUID userId = UUID.randomUUID();
        UUID exerciseId = UUID.randomUUID();
        LocalDate date = LocalDate.of(2026, 11, 11);
        Workout workout = Workout.builder().date(date).build();
        Exercise exercise = Exercise.builder().id(exerciseId).name("Squat").build();
        WorkoutSet firstSet = WorkoutSet.builder()
                .workout(workout)
                .exercise(exercise)
                .reps(8)
                .weightKg(new BigDecimal("10.50"))
                .build();
        WorkoutSet secondSet = WorkoutSet.builder()
                .workout(workout)
                .exercise(exercise)
                .reps(4)
                .weightKg(new BigDecimal("5.25"))
                .build();
        when(workoutSetRepository.findByExerciseAndUser(exerciseId, userId))
                .thenReturn(List.of(firstSet, secondSet));

        var result = progressService.getProgressForExercise(userId, exerciseId);

        assertEquals(1, result.size());
        assertEquals(new BigDecimal("105.00"), result.get(0).totalVolume());
        assertEquals(new BigDecimal("10.50"), result.get(0).maxWeightKg());
        assertEquals(2, result.get(0).totalSets());
    }
}