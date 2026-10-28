package com.fitness_journal.springboot.controller;

import com.fitness_journal.springboot.dto.request.CreateWorkoutRequest;
import com.fitness_journal.springboot.dto.request.UpdateWorkoutRequest;
import com.fitness_journal.springboot.dto.response.WorkoutResponse;
import com.fitness_journal.springboot.entity.User;
import com.fitness_journal.springboot.exception.ResourceNotFoundException;
import com.fitness_journal.springboot.repository.UserRepository;
import com.fitness_journal.springboot.service.WorkoutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workouts")
public class WorkoutController extends BaseController{

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService, UserRepository userRepository) {
        super(userRepository);
        this.workoutService = workoutService;
    }

    @PostMapping
    public ResponseEntity<WorkoutResponse> createWorkout(
            @Valid @RequestBody CreateWorkoutRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(workoutService.createWorkout(resolveUserId(userDetails), request));
    }

    @GetMapping
    public ResponseEntity<Page<WorkoutResponse>> getWorkouts(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 20, sort = "date") Pageable pageable) {
        return ResponseEntity.ok(
                workoutService.getWorkouts(resolveUserId(userDetails), pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutResponse> getWorkout(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                workoutService.getWorkoutById(resolveUserId(userDetails), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutResponse> updateWorkout(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateWorkoutRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                workoutService.updateWorkout(resolveUserId(userDetails), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        workoutService.deleteWorkout(resolveUserId(userDetails), id);
        return ResponseEntity.noContent().build();
    }
}