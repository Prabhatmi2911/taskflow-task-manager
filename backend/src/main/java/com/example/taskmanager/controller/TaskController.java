package com.example.taskmanager.controller;

import com.example.taskmanager.dto.ApiResponse;
import com.example.taskmanager.dto.TaskDto;
import com.example.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Task management CRUD operations.
 * All endpoints require a valid JWT token (enforced by Spring Security).
 *
 * Base URL: /api/tasks
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    /**
     * GET /api/tasks
     * Returns all tasks for the authenticated user.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskDto.Response>>> getAllTasks(
            @AuthenticationPrincipal UserDetails currentUser) {

        List<TaskDto.Response> tasks = taskService.getAllTasks(currentUser.getUsername());

        return ResponseEntity.ok(
                ApiResponse.success("Tasks retrieved successfully", tasks)
        );
    }

    /**
     * POST /api/tasks
     * Creates a new task for the authenticated user.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TaskDto.Response>> createTask(
            @Valid @RequestBody TaskDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails currentUser) {

        TaskDto.Response task = taskService.createTask(request, currentUser.getUsername());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", task));
    }

    /**
     * PUT /api/tasks/{id}
     * Updates an existing task (partial update supported).
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskDto.Response>> updateTask(
            @PathVariable Long id,
            @RequestBody TaskDto.UpdateRequest request,
            @AuthenticationPrincipal UserDetails currentUser) {

        TaskDto.Response task = taskService.updateTask(id, request, currentUser.getUsername());

        return ResponseEntity.ok(
                ApiResponse.success("Task updated successfully", task)
        );
    }

    /**
     * PATCH /api/tasks/{id}/toggle
     * Toggles task status between PENDING and COMPLETED.
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<TaskDto.Response>> toggleTaskStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails currentUser) {

        TaskDto.Response task = taskService.toggleTaskStatus(id, currentUser.getUsername());

        return ResponseEntity.ok(
                ApiResponse.success("Task status updated", task)
        );
    }

    /**
     * DELETE /api/tasks/{id}
     * Deletes a task by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails currentUser) {

        taskService.deleteTask(id, currentUser.getUsername());

        return ResponseEntity.ok(
                ApiResponse.success("Task deleted successfully")
        );
    }
}