package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.Task.Priority;
import com.taskmanager.entity.Task.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserId(Long userId);

    List<Task> findByUserIdAndStatus(Long userId, Status status);

    List<Task> findByUserIdAndPriority(Long userId, Priority priority);

    List<Task> findByUserIdAndStatusAndPriority(Long userId, Status status, Priority priority);

    Optional<Task> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, Status status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status = 'PENDING' AND t.dueDate < CURRENT_DATE")
    long countOverdueTasks(@Param("userId") Long userId);
}
