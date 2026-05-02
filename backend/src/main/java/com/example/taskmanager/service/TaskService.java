package com.example.taskmanager.service;

import com.example.taskmanager.dto.TaskDto;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.TaskStatus;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Task management operations.
 * Handles all business logic for creating, reading, updating, and deleting tasks.
 * All operations are scoped to the currently authenticated user.
 */
@Service
@RequiredArgsConstructor
public class TaskService {

    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    // -------------------------------------------------------
    // Create
    // -------------------------------------------------------

    /**
     * Creates a new task for the specified user.
     *
     * @param request  the task creation request
     * @param username the username of the authenticated user
     * @return the created task as a response DTO
     */
    @Transactional
    public TaskDto.Response createTask(TaskDto.CreateRequest request, String username) {
        User user = getUser(username);

        // Validate and sanitize title
        String title = request.getTitle().trim();
        if (!StringUtils.hasText(title)) {
            throw new IllegalArgumentException("Task title cannot be empty");
        }

        Task task = Task.builder()
                .title(title)
                .description(request.getDescription() != null
                        ? request.getDescription().trim() : null)
                .status(TaskStatus.PENDING)
                .user(user)
                .build();

        Task saved = taskRepository.save(task);
        logger.info("Task created: id={}, title='{}', user='{}'", saved.getId(), saved.getTitle(), username);

        return toResponse(saved);
    }

    // -------------------------------------------------------
    // Read
    // -------------------------------------------------------

    /**
     * Retrieves all tasks for the specified user, ordered by creation date descending.
     *
     * @param username the username of the authenticated user
     * @return list of tasks as response DTOs
     */
    @Transactional(readOnly = true)
    public List<TaskDto.Response> getAllTasks(String username) {
        User user = getUser(username);
        return taskRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------
    // Update
    // -------------------------------------------------------

    /**
     * Updates a task. Supports partial updates — only non-null fields are applied.
     *
     * @param id       the task ID
     * @param request  the update request (partial fields allowed)
     * @param username the username of the authenticated user
     * @return the updated task as a response DTO
     */
    @Transactional
    public TaskDto.Response updateTask(Long id, TaskDto.UpdateRequest request, String username) {
        User user = getUser(username);
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));

        // Apply partial updates
        if (StringUtils.hasText(request.getTitle())) {
            task.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription().trim());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        Task updated = taskRepository.save(task);
        logger.info("Task updated: id={}, status={}, user='{}'", updated.getId(), updated.getStatus(), username);

        return toResponse(updated);
    }

    /**
     * Toggles the status of a task between PENDING and COMPLETED.
     *
     * @param id       the task ID
     * @param username the username of the authenticated user
     * @return the updated task as a response DTO
     */
    @Transactional
    public TaskDto.Response toggleTaskStatus(Long id, String username) {
        User user = getUser(username);
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));

        TaskStatus newStatus = task.getStatus() == TaskStatus.PENDING
                ? TaskStatus.COMPLETED
                : TaskStatus.PENDING;

        task.setStatus(newStatus);
        Task updated = taskRepository.save(task);

        logger.info("Task status toggled: id={}, newStatus={}", id, newStatus);
        return toResponse(updated);
    }

    // -------------------------------------------------------
    // Delete
    // -------------------------------------------------------

    /**
     * Deletes a task by ID, ensuring it belongs to the authenticated user.
     *
     * @param id       the task ID
     * @param username the username of the authenticated user
     */
    @Transactional
    public void deleteTask(Long id, String username) {
        User user = getUser(username);
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task", id));

        taskRepository.delete(task);
        logger.info("Task deleted: id={}, user='{}'", id, username);
    }

    // -------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    /**
     * Maps a Task entity to a TaskDto.Response.
     */
    private TaskDto.Response toResponse(Task task) {
        return TaskDto.Response.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}