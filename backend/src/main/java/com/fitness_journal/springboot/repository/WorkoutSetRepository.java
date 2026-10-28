package com.fitness_journal.springboot.repository;

import com.fitness_journal.springboot.entity.WorkoutSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkoutSetRepository extends JpaRepository<WorkoutSet, UUID> {

    // All sets for a workout, in order
    List<WorkoutSet> findByWorkoutIdOrderBySetNumberAsc(UUID workoutId);

    // For progress tracking — all sets for a specific exercise by a specific user
    @Query("SELECT ws FROM WorkoutSet ws " +
            "WHERE ws.exercise.id = :exerciseId " +
            "AND ws.workout.user.id = :userId " +
            "ORDER BY ws.workout.date ASC")
    List<WorkoutSet> findByExerciseAndUser(
            @Param("exerciseId") UUID exerciseId,
            @Param("userId") UUID userId
    );

    // Security check — confirm this set belongs to this user before modifying
    @Query("SELECT ws FROM WorkoutSet ws " +
            "WHERE ws.id = :setId " +
            "AND ws.workout.user.id = :userId")
    Optional<WorkoutSet> findByIdAndUserId(
            @Param("setId") UUID setId,
            @Param("userId") UUID userId
    );
}