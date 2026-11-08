package com.fitness_journal.springboot.controller;

import com.fitness_journal.springboot.dto.request.UpdateStepsRequest;
import com.fitness_journal.springboot.dto.response.StepEntryResponse;
import com.fitness_journal.springboot.repository.UserRepository;
import com.fitness_journal.springboot.service.StepService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/steps")
public class StepController extends BaseController {

    private final StepService stepService;

    public StepController(StepService stepService,
                          UserRepository userRepository) {
        super(userRepository);
        this.stepService = stepService;
    }

    @GetMapping
    public ResponseEntity<List<StepEntryResponse>> getSteps(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                stepService.getSteps(resolveUserId(userDetails), from, to));
    }

    @PutMapping("/{date}")
    public ResponseEntity<StepEntryResponse> upsertSteps(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @Valid @RequestBody UpdateStepsRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                stepService.upsertSteps(resolveUserId(userDetails), date, request));
    }

    @DeleteMapping("/{date}")
    public ResponseEntity<Void> deleteSteps(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal UserDetails userDetails) {
        stepService.deleteSteps(resolveUserId(userDetails), date);
        return ResponseEntity.noContent().build();
    }
}