package com.taskmanager.dto;

import com.taskmanager.entity.Task;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Dtos {

    // ===== AUTH DTOs =====

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @Email(message = "Valid email required")
        @NotBlank(message = "Email is required")
        private String email;

        @Size(min = 6, message = "Password must be at least 6 characters")
        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private String email;
        private String name;
        private String message;
    }

    // ===== TASK DTOs =====

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskRequest {
        @NotBlank(message = "Title is required")
        private String title;

        private String description;

        private Task.Priority priority;

        private Task.Status status;

        private LocalDate dueDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskResponse {
        private Long id;
        private String title;
        private String description;
        private Task.Priority priority;
        private Task.Status status;
        private LocalDate dueDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private long total;
        private long completed;
        private long pending;
        private long overdue;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApiResponse {
        private boolean success;
        private String message;
        private Object data;
    }
}
