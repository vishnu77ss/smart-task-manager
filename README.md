# ✦ Smart Task Manager

A full-stack task management application built with **React + Vite** (frontend) and **Spring Boot** (backend), featuring JWT authentication, task CRUD, filtering, and a beautiful dark dashboard UI.

---

## 🗂️ Project Structure

```
smart-task-manager/
├── backend/                        # Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/taskmanager/
│       ├── SmartTaskManagerApplication.java
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   └── DataInitializer.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   └── TaskController.java
│       ├── dto/
│       │   └── Dtos.java
│       ├── entity/
│       │   ├── User.java
│       │   └── Task.java
│       ├── exception/
│       │   ├── GlobalExceptionHandler.java
│       │   ├── ResourceNotFoundException.java
│       │   └── DuplicateResourceException.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   └── TaskRepository.java
│       ├── security/
│       │   ├── JwtUtil.java
│       │   ├── JwtAuthFilter.java
│       │   └── CustomUserDetailsService.java
│       └── service/
│           ├── AuthService.java
│           └── TaskService.java
│
└── frontend/                       # React + Vite application
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx
        ├── services/
        │   ├── api.js
        │   ├── authService.js
        │   └── taskService.js
        ├── utils/
        │   └── helpers.js
        ├── components/
        │   ├── ProtectedRoute.jsx
        │   ├── Sidebar.jsx
        │   ├── StatsCard.jsx
        │   ├── TaskCard.jsx
        │   ├── TaskModal.jsx
        │   └── ConfirmModal.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── DashboardPage.jsx
            ├── TasksPage.jsx
            └── NotFoundPage.jsx
```

---

## ⚙️ Prerequisites

- **Java 17+**
- **Maven 3.8+**
- **Node.js 18+** and **npm**
- **MySQL 8.0+**

---

## 🗄️ Step 1: MySQL Setup

Open MySQL and run:

```sql
CREATE DATABASE smart_task_manager
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- (Optional) Create a dedicated user
CREATE USER 'taskuser'@'localhost' IDENTIFIED BY 'taskpass';
GRANT ALL PRIVILEGES ON smart_task_manager.* TO 'taskuser'@'localhost';
FLUSH PRIVILEGES;
```

> **Default config** uses `root / root`. Edit `backend/src/main/resources/application.properties` to match your credentials:
> ```properties
> spring.datasource.username=root
> spring.datasource.password=root
> ```

The tables are created automatically by Spring Data JPA on first run (`ddl-auto=update`).

---

## 🚀 Step 2: Run the Backend

```bash
cd smart-task-manager/backend

# Build the project
mvn clean install -DskipTests

# Run the Spring Boot app
mvn spring-boot:run
```

The backend starts on **http://localhost:8080**

On first run, the `DataInitializer` seeds a demo user and 8 sample tasks automatically.

---

## 💻 Step 3: Run the Frontend

```bash
cd smart-task-manager/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend starts on **http://localhost:5173**

> Vite proxies all `/api` requests to `http://localhost:8080`, so no CORS issues during development.

---

## 👤 Default Test User

| Field    | Value                        |
|----------|------------------------------|
| Name     | Demo User                    |
| Email    | `demo@taskmanager.com`       |
| Password | `demo1234`                   |

There's also a **"Fill automatically"** button on the login page for quick access.

---

## 🔌 API Endpoints

### Auth (Public)
| Method | Endpoint             | Body                              | Description       |
|--------|----------------------|-----------------------------------|-------------------|
| POST   | `/api/auth/register` | `{name, email, password}`         | Register new user |
| POST   | `/api/auth/login`    | `{email, password}`               | Login             |

### Tasks (Requires `Authorization: Bearer <token>`)
| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| GET    | `/api/tasks`          | Get all tasks (optional `?status=&priority=`) |
| GET    | `/api/tasks/stats`    | Get dashboard statistics             |
| GET    | `/api/tasks/{id}`     | Get single task                      |
| POST   | `/api/tasks`          | Create task                          |
| PUT    | `/api/tasks/{id}`     | Update task                          |
| DELETE | `/api/tasks/{id}`     | Delete task                          |

---

## 🧪 API Testing with curl

```bash
# 1. Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@test.com","password":"secret123"}'

# 2. Login and capture token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@taskmanager.com","password":"demo1234"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo "Token: $TOKEN"

# 3. Get all tasks
curl http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN"

# 4. Get dashboard stats
curl http://localhost:8080/api/tasks/stats \
  -H "Authorization: Bearer $TOKEN"

# 5. Create a task
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My New Task","description":"Details here","priority":"HIGH","status":"PENDING","dueDate":"2025-12-31"}'

# 6. Filter tasks by status
curl "http://localhost:8080/api/tasks?status=PENDING" \
  -H "Authorization: Bearer $TOKEN"

# 7. Filter by priority
curl "http://localhost:8080/api/tasks?priority=HIGH" \
  -H "Authorization: Bearer $TOKEN"

# 8. Update a task (replace {id} with actual task id)
curl -X PUT http://localhost:8080/api/tasks/{id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","priority":"LOW","status":"COMPLETED"}'

# 9. Delete a task
curl -X DELETE http://localhost:8080/api/tasks/{id} \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎨 UI Features

- **Dark glassmorphism** design with indigo/purple accent palette
- **Plus Jakarta Sans** font for a modern look
- **Sidebar navigation** with active state indicators
- **Dashboard** with 4 stat cards + progress bar
- **Task cards** with inline checkbox toggle, hover actions, due date labels
- **Create/Edit modal** with priority, status, due date fields
- **Delete confirmation modal**
- **Search bar** with live client-side filtering
- **Status + Priority filter chips** synced to URL params
- **Loading skeletons** during data fetch
- **Password strength indicator** on register
- **Demo credentials shortcut** on login
- **Smooth animations** on all transitions

---

## 🔧 Production Build

```bash
# Frontend build
cd frontend
npm run build
# Output in frontend/dist/

# Backend JAR
cd backend
mvn clean package -DskipTests
java -jar target/smart-task-manager-1.0.0.jar
```

---

## 🛠️ Tech Stack Summary

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router, Axios |
| Backend    | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth       | JWT (jjwt 0.11.5)        |
| Database   | MySQL 8                 |
| ORM        | Hibernate / JPA         |
| Build      | Maven (backend), npm (frontend) |
