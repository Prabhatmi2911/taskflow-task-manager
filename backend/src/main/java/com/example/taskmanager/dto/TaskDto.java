package com.example.taskmanager.dto;

import com.example.taskmanager.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Objects for Task-related API requests and responses.
 * Separates API contract from internal entity structure.
 */
public class TaskDto {

    // -------------------------------------------------------
    // Request DTOs
    // -------------------------------------------------------

    /**
     * DTO for creating a new task.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {

        @NotBlank(message = "Task title is required")
        private String title;

        private String description;
    }

    /**
     * DTO for updating an existing task.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRequest {

        private String title;

        private String description;

        private TaskStatus status;
    }

    // -------------------------------------------------------
    // Response DTOs
    // -------------------------------------------------------

    /**
     * DTO returned in API responses for a task.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {

        private Long id;
        private String title;
        private String description;
        private TaskStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}