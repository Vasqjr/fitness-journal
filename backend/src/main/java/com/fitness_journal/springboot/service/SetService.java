package com.fitness_journal.springboot.service;

import com.fitness_journal.springboot.dto.request.CreateSetRequest;
import com.fitness_journal.springboot.dto.request.UpdateSetRequest;
import com.fitness_journal.springboot.dto.response.SetResponse;
import com.fitness_journal.springboot.entity.Exercise;
import com.fitness_journal.springboot.entity.Workout;
import com.fitness_journal.springboot.entity.WorkoutSet;
import com.fitness_journal.springboot.exception.ResourceNotFoundException;
import com.fitness_journal.springboot.repository.ExerciseRepository;
import com.fitness_journal.springboot.repository.WorkoutRepository;
import com.fitness_journal.springboot.repository.WorkoutSetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SetService {

    private final WorkoutSetRepository workoutSetRepository;
    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;

    @Transactional
    public SetResponse addSet(UUID userId, UUID workoutId, CreateSetRequest request) {
        // Ownership check — confirms this workout belongs to this user
        Workout workout = workoutRepository.findByIdAndUserId(workoutId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found"));

        Exercise exercise = exerciseRepository.findById(request.exerciseId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        WorkoutSet set = WorkoutSet.builder()
                .workout(workout)
                .exercise(exercise)
                .setNumber(request.setNumber())
                .reps(request.reps())
                .weightKg(request.weightKg())
                .rpe(request.rpe())
                .notes(request.notes())
                .build();

        workoutSetRepository.save(set);
        return toResponse(set);
    }

    @Transactional
    public SetResponse updateSet(UUID userId, UUID setId, UpdateSetRequest request) {
        WorkoutSet set = workoutSetRepository.findByIdAndUserId(setId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Set not found"));

        if (request.reps() != null) set.setReps(request.reps());
        if (request.weightKg() != null) set.setWeightKg(request.weightKg());
        if (request.rpe() != null) set.setRpe(request.rpe());
        if (request.notes() != null) set.setNotes(request.notes());

        workoutSetRepository.save(set);
        return toResponse(set);
    }

    @Transactional
    public void deleteSet(UUID userId, UUID setId) {
        WorkoutSet set = workoutSetRepository.findByIdAndUserId(setId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Set not found"));

        workoutSetRepository.delete(set);
    }

    private SetResponse toResponse(WorkoutSet ws) {
        return new SetResponse(
                ws.getId(),
                ws.getExercise().getId(),
                ws.getExercise().getName(),
                ws.getSetNumber(),
                ws.getReps(),
                ws.getWeightKg(),
                ws.getRpe(),
                ws.getNotes()
        );
    }
}
