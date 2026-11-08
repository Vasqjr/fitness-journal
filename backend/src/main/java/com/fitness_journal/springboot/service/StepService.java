package com.fitness_journal.springboot.service;

import com.fitness_journal.springboot.dto.request.UpdateStepsRequest;
import com.fitness_journal.springboot.dto.response.StepEntryResponse;
import com.fitness_journal.springboot.entity.StepEntry;
import com.fitness_journal.springboot.repository.StepEntryRepository;
import com.fitness_journal.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StepService {

    private static final int MAX_RANGE_DAYS = 366;

    private final StepEntryRepository stepEntryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<StepEntryResponse> getSteps(UUID userId, LocalDate from, LocalDate to) {
        if (from.isAfter(to)) {
            throw badRequest("'from' must be on or before 'to'.");
        }
        if (ChronoUnit.DAYS.between(from, to) > MAX_RANGE_DAYS) {
            throw badRequest("Date range cannot exceed " + MAX_RANGE_DAYS + " days.");
        }
        return stepEntryRepository
                .findByUserIdAndStepDateBetweenOrderByStepDateAsc(userId, from, to)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Creates the day's entry, or overwrites it if one already exists
    @Transactional
    public StepEntryResponse upsertSteps(UUID userId, LocalDate date, UpdateStepsRequest request) {
        // The server runs in UTC, so allow one day of slack for users ahead of UTC
        if (date.isAfter(LocalDate.now(ZoneOffset.UTC).plusDays(1))) {
            throw badRequest("Steps cannot be logged for a future date.");
        }

        StepEntry entry = stepEntryRepository.findByUserIdAndStepDate(userId, date)
                .orElseGet(() -> StepEntry.builder()
                        .user(userRepository.getReferenceById(userId))
                        .stepDate(date)
                        .build());
        entry.setSteps(request.steps());

        return toResponse(stepEntryRepository.save(entry));
    }

    // Deleting a day with no entry is a no-op, so repeated calls are safe
    @Transactional
    public void deleteSteps(UUID userId, LocalDate date) {
        stepEntryRepository.findByUserIdAndStepDate(userId, date)
                .ifPresent(stepEntryRepository::delete);
    }

    private StepEntryResponse toResponse(StepEntry entry) {
        return new StepEntryResponse(entry.getId(), entry.getStepDate(), entry.getSteps());
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}