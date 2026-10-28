package com.fitness_journal.springboot.repository;

import com.fitness_journal.springboot.entity.Workout;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, UUID> {

    // All workouts for a user, paginated, newest first
    Page<Workout> findByUserIdOrderByDateDesc(UUID userId, Pageable pageable);

    // Find a specific workout — also checks it belongs to this user (security!)
    Optional<Workout> findByIdAndUserId(UUID id, UUID userId);
}