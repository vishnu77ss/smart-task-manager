package com.taskmanager.controller;

import com.taskmanager.dto.Dtos;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    // GET /api/tasks?status=PENDING&priority=HIGH
    @GetMapping
    public ResponseEntity<List<Dtos.TaskResponse>> getTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority) {
        return ResponseEntity.ok(taskService.getTasks(status, priority));
    }

    // GET /api/tasks/stats
    @GetMapping("/stats")
    public ResponseEntity<Dtos.DashboardStats> getStats() {
        return ResponseEntity.ok(taskService.getDashboardStats());
    }

    // GET /api/tasks/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Dtos.TaskResponse> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    // POST /api/tasks
    @PostMapping
    public ResponseEntity<Dtos.TaskResponse> createTask(@Valid @RequestBody Dtos.TaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(request));
    }

    // PUT /api/tasks/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Dtos.TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody Dtos.TaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    // DELETE /api/tasks/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Dtos.ApiResponse> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(Dtos.ApiResponse.builder()
                .success(true)
                .message("Task deleted successfully")
                .build());
    }
}
