package com.fitness_journal.springboot.repository;

import com.fitness_journal.springboot.entity.StepEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StepEntryRepository extends JpaRepository<StepEntry, UUID> {

    Optional<StepEntry> findByUserIdAndStepDate(UUID userId, LocalDate stepDate);

    List<StepEntry> findByUserIdAndStepDateBetweenOrderByStepDateAsc(
            UUID userId, LocalDate from, LocalDate to);
}