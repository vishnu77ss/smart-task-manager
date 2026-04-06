package com.taskmanager.config;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Only seed if no users exist
        if (userRepository.count() == 0) {
            log.info("Seeding database with sample data...");

            // Create demo user
            User user = User.builder()
                    .name("Demo User")
                    .email("demo@taskmanager.com")
                    .password(passwordEncoder.encode("demo1234"))
                    .build();
            user = userRepository.save(user);

            // Create sample tasks
            List<Task> sampleTasks = List.of(
                Task.builder()
                    .title("Set up project infrastructure")
                    .description("Configure CI/CD pipeline, Docker containers, and cloud deployment settings.")
                    .priority(Task.Priority.HIGH)
                    .status(Task.Status.COMPLETED)
                    .dueDate(LocalDate.now().minusDays(2))
                    .user(user)
                    .build(),
                Task.builder()
                    .title("Design database schema")
                    .description("Create ERD and finalize table structures for all entities.")
                    .priority(Task.Priority.HIGH)
                    .status(Task.Status.COMPLETED)
                    .dueDate(LocalDate.now().minusDays(1))
                    .user(user)
                    .build(),
                Task.builder()
                    .title("Implement authentication API")
                    .description("Build JWT-based login and registration endpoints with Spring Security.")
                    .priority(Task.Priority.HIGH)
                    .status(Task.Status.PENDING)
                    .dueDate(LocalDate.now().plusDays(1))
                    .user(user)
                    .build(),
                Task.builder()
                    .title("Build task management UI")
                    .description("Create React components for the dashboard, task cards, and modals.")
                    .priority(Task.Priority.MEDIUM)
                    .status(Task.Status.PENDING)
                    .dueDate(LocalDate.now().plusDays(3))
                    .user(user)
                    .build(),
                Task.builder()
                    .title("Write unit tests")
                    .description("Cover service layer with JUnit tests and mock repositories.")
                    .priority(Task.Priority.MEDIUM)
                    .status(Task.Status.PENDING)
                    .dueDate(LocalDate.now().plusDays(5))
                    .user(user)
                    .build(),
                Task.builder()
                    .title("Update project documentation")
                    .description("Add API documentation with Swagger and update README.")
                    .priority(Task.Priority.LOW)
                    .status(Task.Status.PENDING)
                    .dueDate(LocalDate.now().plusDays(7))
                    .user(user)
                    .build(),
                Task.builder()
                    .title("Performance optimization")
                    .description("Profile slow queries, add indexes, and optimize React renders.")
                    .priority(Task.Priority.LOW)
                    .status(Task.Status.PENDING)
                    .dueDate(LocalDate.now().plusDays(10))
                    .user(user)
                    .build(),
                Task.builder()
                    .title("Security audit")
                    .description("Review auth flow, check for XSS/SQL injection vulnerabilities.")
                    .priority(Task.Priority.HIGH)
                    .status(Task.Status.PENDING)
                    .dueDate(LocalDate.now().plusDays(2))
                    .user(user)
                    .build()
            );

            taskRepository.saveAll(sampleTasks);
            log.info("Sample data seeded. Login with: demo@taskmanager.com / demo1234");
        }
    }
}
