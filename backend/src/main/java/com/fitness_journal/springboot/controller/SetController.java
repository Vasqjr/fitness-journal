package com.fitness_journal.springboot.controller;

import com.fitness_journal.springboot.dto.request.CreateSetRequest;
import com.fitness_journal.springboot.dto.request.UpdateSetRequest;
import com.fitness_journal.springboot.dto.response.SetResponse;
import com.fitness_journal.springboot.repository.UserRepository;
import com.fitness_journal.springboot.service.SetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workouts/{workoutId}/sets")
public class SetController extends BaseController {

    private final SetService setService;

    public SetController(SetService setService, UserRepository userRepository) {
        super(userRepository);
        this.setService = setService;
    }

    @PostMapping
    public ResponseEntity<SetResponse> addSet(
            @PathVariable UUID workoutId,
            @Valid @RequestBody CreateSetRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(setService.addSet(resolveUserId(userDetails), workoutId, request));
    }

    @PutMapping("/{setId}")
    public ResponseEntity<SetResponse> updateSet(
            @PathVariable UUID workoutId,
            @PathVariable UUID setId,
            @Valid @RequestBody UpdateSetRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                setService.updateSet(resolveUserId(userDetails), setId, request));
    }

    @DeleteMapping("/{setId}")
    public ResponseEntity<Void> deleteSet(
            @PathVariable UUID workoutId,
            @PathVariable UUID setId,
            @AuthenticationPrincipal UserDetails userDetails) {
        setService.deleteSet(resolveUserId(userDetails), setId);
        return ResponseEntity.noContent().build();
    }
}