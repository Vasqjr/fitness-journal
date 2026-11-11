package com.fitness_journal.springboot.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class GlobalExceptionHandlerTest {

    @Test
    void mapsDuplicateAccountConflictsToHttp409() {
        ResponseEntity<Map<String, Object>> response =
                new GlobalExceptionHandler().handleConflict(new ConflictException("Email already in use"));

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("Email already in use", response.getBody().get("error"));
    }
}