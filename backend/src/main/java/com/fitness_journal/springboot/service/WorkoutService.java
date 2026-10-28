package com.fitness_journal.springboot.service;

import com.fitness_journal.springboot.dto.request.CreateWorkoutRequest;
import com.fitness_journal.springboot.dto.request.UpdateWorkoutRequest;
import com.fitness_journal.springboot.dto.response.SetResponse;
import com.fitness_journal.springboot.dto.response.WorkoutResponse;
import com.fitness_journal.springboot.entity.User;
import com.fitness_journal.springboot.entity.Workout;
import com.fitness_journal.springboot.exception.ResourceNotFoundException;
import com.fitness_journal.springboot.repository.UserRepository;
import com.fitness_journal.springboot.repository.WorkoutRepository;
import com.fitness_journal.springboot.repository.WorkoutSetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final WorkoutSetRepository workoutSetRepository;
    private final UserRepository userRepository;

    @Transactional
    public WorkoutResponse createWorkout(UUID userId, CreateWorkoutRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Workout workout = Workout.builder()
                .user(user)
                .name(request.name())
                .date(request.date())
                .durationMinutes(request.durationMinutes())
                .notes(request.notes())
                .build();

        workoutRepository.save(workout);
        return toResponse(workout, List.of());
    }

    @Transactional(readOnly = true)
    public Page<WorkoutResponse> getWorkouts(UUID userId, Pageable pageable) {
        return workoutRepository
                .findByUserIdOrderByDateDesc(userId, pageable)
                .map(workout -> {
                    List<SetResponse> sets = workoutSetRepository
                            .findByWorkoutIdOrderBySetNumberAsc(workout.getId())
                            .stream()
                            .map(this::toSetResponse)
                            .toList();
                    return toResponse(workout, sets);
                });
    }

    @Transactional(readOnly = true)
    public WorkoutResponse getWorkoutById(UUID userId, UUID workoutId) {
        Workout workout = workoutRepository.findByIdAndUserId(workoutId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found"));

        List<SetResponse> sets = workoutSetRepository
                .findByWorkoutIdOrderBySetNumberAsc(workoutId)
                .stream()
                .map(this::toSetResponse)
                .toList();

        return toResponse(workout, sets);
    }

    @Transactional
    public WorkoutResponse updateWorkout(UUID userId, UUID workoutId,
                                         UpdateWorkoutRequest request) {
        Workout workout = workoutRepository.findByIdAndUserId(workoutId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found"));

        // Only update fields that were actually provided
        if (request.name() != null) workout.setName(request.name());
        if (request.date() != null) workout.setDate(request.date());
        if (request.durationMinutes() != null) workout.setDurationMinutes(request.durationMinutes());
        if (request.notes() != null) workout.setNotes(request.notes());

        workoutRepository.save(workout);

        List<SetResponse> sets = workoutSetRepository
                .findByWorkoutIdOrderBySetNumberAsc(workoutId)
                .stream()
                .map(this::toSetResponse)
                .toList();

        return toResponse(workout, sets);
    }

    @Transactional
    public void deleteWorkout(UUID userId, UUID workoutId) {
        Workout workout = workoutRepository.findByIdAndUserId(workoutId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found"));

        workoutRepository.delete(workout);
    }

    // --- Mapping helpers ---

    private WorkoutResponse toResponse(Workout workout, List<SetResponse> sets) {
        return new WorkoutResponse(
                workout.getId(),
                workout.getName(),
                workout.getDate(),
                workout.getDurationMinutes(),
                workout.getNotes(),
                workout.getCreatedAt(),
                sets
        );
    }

    private SetResponse toSetResponse(com.fitness_journal.springboot.entity.WorkoutSet ws) {
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
