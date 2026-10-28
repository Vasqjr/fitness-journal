package com.fitness_journal.springboot.service;

import com.fitness_journal.springboot.dto.request.CreateExerciseRequest;
import com.fitness_journal.springboot.dto.response.ExerciseResponse;
import com.fitness_journal.springboot.entity.Exercise;
import com.fitness_journal.springboot.entity.User;
import com.fitness_journal.springboot.exception.ResourceNotFoundException;
import com.fitness_journal.springboot.exception.UnauthorizedException;
import com.fitness_journal.springboot.repository.ExerciseRepository;
import com.fitness_journal.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ExerciseResponse> getExercises(UUID userId) {
        return exerciseRepository.findAllAvailableForUser(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ExerciseResponse createCustomExercise(UUID userId, CreateExerciseRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Exercise exercise = Exercise.builder()
                .name(request.name())
                .muscleGroup(request.muscleGroup())
                .description(request.description())
                .isCustom(true)
                .createdBy(user)
                .build();

        exerciseRepository.save(exercise);
        return toResponse(exercise);
    }

    @Transactional
    public void deleteCustomExercise(UUID userId, UUID exerciseId) {
        Exercise exercise = exerciseRepository.findByIdAndCreatedById(exerciseId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        if (!exercise.isCustom()) {
            throw new UnauthorizedException("Cannot delete a global exercise");
        }

        exerciseRepository.delete(exercise);
    }

    private ExerciseResponse toResponse(Exercise exercise) {
        return new ExerciseResponse(
                exercise.getId(),
                exercise.getName(),
                exercise.getMuscleGroup(),
                exercise.getDescription(),
                exercise.isCustom()
        );
    }
}