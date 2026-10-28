package com.fitness_journal.springboot.controller;

import com.fitness_journal.springboot.dto.request.CreateExerciseRequest;
import com.fitness_journal.springboot.dto.response.ExerciseResponse;
import com.fitness_journal.springboot.repository.UserRepository;
import com.fitness_journal.springboot.service.ExerciseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/exercises")
public class ExerciseController extends BaseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService,
                              UserRepository userRepository) {
        super(userRepository);
        this.exerciseService = exerciseService;
    }

    @GetMapping
    public ResponseEntity<List<ExerciseResponse>> getExercises(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                exerciseService.getExercises(resolveUserId(userDetails)));
    }

    @PostMapping
    public ResponseEntity<ExerciseResponse> createExercise(
            @Valid @RequestBody CreateExerciseRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(exerciseService.createCustomExercise(
                        resolveUserId(userDetails), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        exerciseService.deleteCustomExercise(resolveUserId(userDetails), id);
        return ResponseEntity.noContent().build();
    }
}