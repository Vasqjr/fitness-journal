package com.fitness_journal.springboot.controller;

import com.fitness_journal.springboot.dto.response.ProgressPointResponse;
import com.fitness_journal.springboot.repository.UserRepository;
import com.fitness_journal.springboot.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/progress")
public class ProgressController extends BaseController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService,
                              UserRepository userRepository) {
        super(userRepository);
        this.progressService = progressService;
    }

    @GetMapping("/{exerciseId}")
    public ResponseEntity<List<ProgressPointResponse>> getProgress(
            @PathVariable UUID exerciseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                progressService.getProgressForExercise(
                        resolveUserId(userDetails), exerciseId));
    }
}
