package com.fitness_journal.springboot.service;

import com.fitness_journal.springboot.dto.response.ProgressPointResponse;
import com.fitness_journal.springboot.entity.WorkoutSet;
import com.fitness_journal.springboot.repository.WorkoutSetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final WorkoutSetRepository workoutSetRepository;

    @Transactional(readOnly = true)
    public List<ProgressPointResponse> getProgressForExercise(UUID userId, UUID exerciseId) {
        List<WorkoutSet> sets = workoutSetRepository
                .findByExerciseAndUser(exerciseId, userId);

        // Group sets by date, then compute stats per day
        Map<LocalDate, List<WorkoutSet>> byDate = new LinkedHashMap<>();
        for (WorkoutSet set : sets) {
            LocalDate date = set.getWorkout().getDate();
            byDate.computeIfAbsent(date, d -> new ArrayList<>()).add(set);
        }

        List<ProgressPointResponse> result = new ArrayList<>();
        for (Map.Entry<LocalDate, List<WorkoutSet>> entry : byDate.entrySet()) {
            LocalDate date = entry.getKey();
            List<WorkoutSet> daySets = entry.getValue();

            BigDecimal maxWeight = daySets.stream()
                    .map(WorkoutSet::getWeightKg)
                    .filter(Objects::nonNull)
                    .max(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);

            int totalVolume = daySets.stream()
                    .filter(s -> s.getReps() != null && s.getWeightKg() != null)
                    .mapToInt(s -> s.getReps() * s.getWeightKg().intValue())
                    .sum();

            result.add(new ProgressPointResponse(date, maxWeight, totalVolume, daySets.size()));
        }

        return result;
    }
}
