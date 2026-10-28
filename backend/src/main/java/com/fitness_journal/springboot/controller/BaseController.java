package com.fitness_journal.springboot.controller;

import com.fitness_journal.springboot.entity.User;
import com.fitness_journal.springboot.exception.ResourceNotFoundException;
import com.fitness_journal.springboot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;

@RequiredArgsConstructor
public abstract class BaseController {

    protected final UserRepository userRepository;

    protected UUID resolveUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
