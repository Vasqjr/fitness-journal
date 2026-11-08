package com.fitness_journal.springboot.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
        name = "step_entries",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_step_entries_user_date",
                columnNames = {"user_id", "step_date"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StepEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @Column(name = "step_date", nullable = false)
    private LocalDate stepDate;

    @Column(nullable = false)
    private int steps;
}