package com.fitness_journal.springboot.dto.response;

import java.util.UUID;

public record AuthResponse(
        String token,
        String tokenType,   // always "Bearer"
        UUID userId,
        String email,
        String displayName
) {}