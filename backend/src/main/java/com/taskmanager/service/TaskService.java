package com.taskmanager.service;

import com.taskmanager.dto.Dtos;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Dtos.TaskResponse toResponse(Task task) {
        return Dtos.TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    public List<Dtos.TaskResponse> getTasks(String status, String priority) {
        Long userId = getCurrentUser().getId();
        List<Task> tasks;

        if (status != null && priority != null) {
            tasks = taskRepository.findByUserIdAndStatusAndPriority(
                    userId,
                    Task.Status.valueOf(status.toUpperCase()),
                    Task.Priority.valueOf(priority.toUpperCase())
            );
        } else if (status != null) {
            tasks = taskRepository.findByUserIdAndStatus(
                    userId, Task.Status.valueOf(status.toUpperCase()));
        } else if (priority != null) {
            tasks = taskRepository.findByUserIdAndPriority(
                    userId, Task.Priority.valueOf(priority.toUpperCase()));
        } else {
            tasks = taskRepository.findByUserId(userId);
        }

        return tasks.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Dtos.TaskResponse getTaskById(Long id) {
        Long userId = getCurrentUser().getId();
        Task task = taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return toResponse(task);
    }

    public Dtos.TaskResponse createTask(Dtos.TaskRequest request) {
        User user = getCurrentUser();

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : Task.Priority.MEDIUM)
                .status(request.getStatus() != null ? request.getStatus() : Task.Status.PENDING)
                .dueDate(request.getDueDate())
                .user(user)
                .build();

        return toResponse(taskRepository.save(task));
    }

    public Dtos.TaskResponse updateTask(Long id, Dtos.TaskRequest request) {
        Long userId = getCurrentUser().getId();
        Task task = taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());

        return toResponse(taskRepository.save(task));
    }

    public void deleteTask(Long id) {
        Long userId = getCurrentUser().getId();
        Task task = taskRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        taskRepository.delete(task);
    }

    public Dtos.DashboardStats getDashboardStats() {
        Long userId = getCurrentUser().getId();
        long total = taskRepository.countByUserId(userId);
        long completed = taskRepository.countByUserIdAndStatus(userId, Task.Status.COMPLETED);
        long pending = taskRepository.countByUserIdAndStatus(userId, Task.Status.PENDING);
        long overdue = taskRepository.countOverdueTasks(userId);

        return Dtos.DashboardStats.builder()
                .total(total)
                .completed(completed)
                .pending(pending)
                .overdue(overdue)
                .build();
    }
}