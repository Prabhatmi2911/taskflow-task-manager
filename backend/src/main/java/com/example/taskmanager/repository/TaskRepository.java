package com.example.taskmanager.repository;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.TaskStatus;
import com.example.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Task entity.
 * Provides data access methods for task-related operations.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Find all tasks belonging to a specific user, ordered by creation date descending.
     */
    List<Task> findByUserOrderByCreatedAtDesc(User user);

    /**
     * Find tasks by user and status.
     */
    List<Task> findByUserAndStatusOrderByCreatedAtDesc(User user, TaskStatus status);

    /**
     * Find a task by id and user (ensures ownership).
     */
    Optional<Task> findByIdAndUser(Long id, User user);

    /**
     * Count tasks by user and status.
     */
    long countByUserAndStatus(User user, TaskStatus status);
}