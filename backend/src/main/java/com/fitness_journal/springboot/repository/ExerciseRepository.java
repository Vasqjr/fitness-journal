package com.fitness_journal.springboot.repository;

import com.fitness_journal.springboot.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {

    // Get all global exercises + this user's custom ones
    // This one is too complex for a derived method name, so we write JPQL
    @Query("SELECT e FROM Exercise e WHERE e.isCustom = false " +
            "OR (e.isCustom = true AND e.createdBy.id = :userId)")
    List<Exercise> findAllAvailableForUser(@Param("userId") UUID userId);

    // Used when deleting — only owner can delete their custom exercise
    Optional<Exercise> findByIdAndCreatedById(UUID id, UUID createdById);
}