package com.taskmanager.exception;

import com.taskmanager.dto.Dtos;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Dtos.ApiResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Dtos.ApiResponse.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .build());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Dtos.ApiResponse> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Dtos.ApiResponse.builder()
                        .success(false)
                        .message("Invalid email or password")
                        .build());
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Dtos.ApiResponse> handleDuplicate(DuplicateResourceException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Dtos.ApiResponse.builder()
                        .success(false)
                        .message(ex.getMessage())
                        .build());
    }

    // Handle validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(fieldName, message);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Dtos.ApiResponse> handleGeneral(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Dtos.ApiResponse.builder()
                        .success(false)
                        .message("An unexpected error occurred: " + ex.getMessage())
                        .build());
    }
}
