package com.fitness_journal.springboot.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

// One data point on a progress chart
public record ProgressPointResponse(
        LocalDate date,
        BigDecimal maxWeightKg,     // heaviest set that day
        Integer totalVolume,        // total reps x weight for the day
        Integer totalSets
) {}