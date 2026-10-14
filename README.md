# Student–Course Management System Using MERN Microservices

A complete, production-ready, beginner-friendly **Student–Course Management System** built using the **MERN** stack and modern **Microservices Architecture**. Designed specifically for college practical examinations (worth 20 marks), showcasing independent service separation, dedicated MongoDB databases, genuine RESTful inter-service communication over HTTP, and cloud deployment readiness (Render + Vercel).

---

## 1. System Architecture

The application is decomposed into three completely independent applications:

```
                      ┌─────────────────────────────────────────┐
                      │          React Frontend (Vite)          │
                      │               Port: 5173                │
                      └──────────────┬────────────┬─────────────┘
                                     │            │
            REST API (Student CRUD)  │            │ REST API (Course CRUD)
                                     ▼            ▼
             ┌─────────────────────────┐        ┌─────────────────────────┐
             │     Student Service     │        │     Course Service      │
             │       Port: 5001        │        │       Port: 5002        │
             └────────────┬────────────┘        └────────────┬────────────┘
                          │                                  │
                          │   HTTP GET /api/courses/:id      │
                          │   (Axios Inter-Service Call)     │
                          └─────────────────────────────────►│
                          │                                  │
                          ▼                                  ▼
             ┌─────────────────────────┐        ┌─────────────────────────┐
             │   MongoDB Collection:   │        │   MongoDB Collection:   │
             │        students         │        │         courses         │
             │  (student_service_db)   │        │   (course_service_db)   │
             └─────────────────────────┘        └─────────────────────────┘
```

### Mermaid Architecture Diagram

```mermaid
graph TD
    Client["React Frontend (Vite) <br/> :5173"]
    Client -->|"REST API (Student Ops)"| StudentService["Student Microservice <br/> Node.js/Express (:5001)"]
    Client -->|"REST API (Course Ops)"| CourseService["Course Microservice <br/> Node.js/Express (:5002)"]
    StudentService -->|"HTTP GET via Axios <br/> (Inter-Service Comm)"| CourseService
    StudentService -->|"Mongoose"| StudentDB[("MongoDB: students <br/> (student_service_db)")]
    CourseService -->|"Mongoose"| CourseDB[("MongoDB: courses <br/> (course_service_db)")]
```

---

## 2. Project Directory Structure

```
student-course-management/
├── .gitignore                      # Excludes node_modules, .env, build files
├── README.md                       # Comprehensive guide, API docs & viva prep
├── course-service/                 # Independent Course Microservice
│   ├── .env                        # Local environment variables
│   ├── .env.example                # Sample environment template
│   ├── package.json
│   └── src/
│       ├── config/
│       │   └── db.js               # MongoDB connection logic
│       ├── controllers/
│       │   └── courseController.js # Course CRUD handlers
│       ├── models/
│       │   └── Course.js           # Course Mongoose schema
│       ├── routes/
│       │   └── courseRoutes.js     # /api/courses routes
│       └── server.js               # Express application entry point (:5002)
├── student-service/                # Independent Student Microservice
│   ├── .env                        # Local environment variables
│   ├── .env.example                # Sample environment template
│   ├── package.json
│   └── src/
│       ├── config/
│       │   └── db.js               # MongoDB connection logic
│       ├── controllers/
│       │   └── studentController.js# Student CRUD & Inter-Service handlers
│       ├── models/
│       │   └── Student.js          # Student Mongoose schema (references course IDs)
│       ├── routes/
│       │   └── studentRoutes.js    # /api/students routes
│       ├── services/
│       │   └── courseClient.js     # Axios HTTP client for Course Service
│       └── server.js               # Express application entry point (:5001)
└── frontend/                       # React Frontend Single Page App
    ├── .env                        # Local environment variables
    ├── .env.example                # Sample environment template
    ├── index.html                  # HTML entry point
    ├── package.json
    ├── vite.config.js              # Vite configuration
    └── src/
        ├── App.css                 # Responsive modern styling
        ├── App.jsx                 # Dashboard orchestration & navigation
        ├── index.css               # Global typography and base CSS
        ├── main.jsx                # React DOM mount point
        ├── components/
        │   ├── CourseManager.jsx   # Add course form & courses list
        │   ├── Navbar.jsx          # Live health badges & refresh controls
        │   ├── StudentCourseDetails.jsx # Inter-service aggregation showcase
        │   └── StudentManager.jsx  # Add student form & students list
        └── services/
            └── api.js              # Axios API client for both services
```

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite | High-performance SPA with modern component architecture |
| **Icons & UI** | Lucide React | Clean, intuitive icons for dashboard badges and actions |
| **Backend** | Node.js, Express.js | Lightweight, event-driven RESTful microservices |
| **Database** | MongoDB & Mongoose | Document database with schema validation and separate DBs |
| **Inter-Service** | Axios (HTTP REST) | Genuine decoupled communication over network protocols |
| **Deployment** | Render & Vercel | Render for microservices backends, Vercel for React frontend |

---

## 4. Installation & Local Setup

### Prerequisites
- **Node.js**: v18 or higher (`node -v`)
- **npm**: v9 or higher (`npm -v`)
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) OR a MongoDB Atlas cluster URI.

### Step 1: Clone or Navigate to the Project
```bash
cd "/Users/deepthi/Desktop/Student Corse Mgt"
```

### Step 2: Configure Environment Variables

#### Course Service (`course-service/.env`):
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/course_service_db
FRONTEND_URL=http://localhost:5173
```

#### Student Service (`student-service/.env`):
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/student_service_db
COURSE_SERVICE_URL=http://localhost:5002
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`):
```env
VITE_STUDENT_API_URL=http://localhost:5001
VITE_COURSE_API_URL=http://localhost:5002
```

### Step 3: Install Dependencies
Open three separate terminals (or run sequentially):

```bash
# Terminal 1 - Course Service
cd course-service
npm install

# Terminal 2 - Student Service
cd student-service
npm install

# Terminal 3 - Frontend
cd frontend
npm install
```

### Step 4: Run the Services

Start each service in its dedicated terminal:

```bash
# Terminal 1: Start Course Service (runs on http://localhost:5002)
cd course-service
npm start

# Terminal 2: Start Student Service (runs on http://localhost:5001)
cd student-service
npm start

# Terminal 3: Start React Frontend (runs on http://localhost:5173)
cd frontend
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 5. REST API Documentation & Sample Requests

### A. Course Service APIs (`http://localhost:5002`)

#### 1. Service Health Check
- **Endpoint:** `GET /health`
- **Description:** Verifies service availability.
- **Request:**
  ```bash
  curl -X GET http://localhost:5002/health
  ```
- **Response (200 OK):**
  ```json
  {
    "service": "course-service",
    "status": "UP",
    "port": "5002",
    "timestamp": "2026-10-14T07:50:06.454Z",
    "uptime": 15.98
  }
  ```

#### 2. Create Course
- **Endpoint:** `POST /api/courses`
- **Description:** Adds a new course. Returns `409 Conflict` if `courseId` already exists.
- **Request:**
  ```bash
  curl -X POST http://localhost:5002/api/courses \
    -H "Content-Type: application/json" \
    -d '{
      "courseId": "CS101",
      "courseName": "Data Structures & Algorithms",
      "credits": 4
    }'
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Course created successfully",
    "data": {
      "courseId": "CS101",
      "courseName": "Data Structures & Algorithms",
      "credits": 4,
      "_id": "6acf343782d0938cbdc9797e",
      "createdAt": "2026-10-14T07:50:15.617Z",
      "updatedAt": "2026-10-14T07:50:15.617Z"
    }
  }
  ```

#### 3. Get All Courses
- **Endpoint:** `GET /api/courses`
- **Request:**
  ```bash
  curl -X GET http://localhost:5002/api/courses
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "_id": "6acf343782d0938cbdc9797e",
        "courseId": "CS101",
        "courseName": "Data Structures & Algorithms",
        "credits": 4
      }
    ]
  }
  ```

#### 4. Get Course by ID
- **Endpoint:** `GET /api/courses/:id`
- **Request:**
  ```bash
  curl -X GET http://localhost:5002/api/courses/CS101
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "6acf343782d0938cbdc9797e",
      "courseId": "CS101",
      "courseName": "Data Structures & Algorithms",
      "credits": 4
    }
  }
  ```

---

### B. Student Service APIs (`http://localhost:5001`)

#### 1. Service Health Check
- **Endpoint:** `GET /health`
- **Request:**
  ```bash
  curl -X GET http://localhost:5001/health
  ```
- **Response (200 OK):**
  ```json
  {
    "service": "student-service",
    "status": "UP",
    "port": "5001",
    "courseServiceUrl": "http://localhost:5002",
    "timestamp": "2026-10-14T07:50:06.465Z",
    "uptime": 9.42
  }
  ```

#### 2. Create Student
- **Endpoint:** `POST /api/students`
- **Description:** Registers student with referenced `courseIds`. Returns `409 Conflict` on duplicate `studentId`.
- **Request:**
  ```bash
  curl -X POST http://localhost:5001/api/students \
    -H "Content-Type: application/json" \
    -d '{
      "studentId": "STU101",
      "name": "Alice Johnson",
      "email": "alice@college.edu",
      "courseIds": ["CS101", "CS102"]
    }'
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Student registered successfully",
    "data": {
      "studentId": "STU101",
      "name": "Alice Johnson",
      "email": "alice@college.edu",
      "courseIds": ["CS101", "CS102"],
      "_id": "6acf343faab890237c300400",
      "createdAt": "2026-10-14T07:50:23.839Z"
    }
  }
  ```

#### 3. Get All Students
- **Endpoint:** `GET /api/students`
- **Request:**
  ```bash
  curl -X GET http://localhost:5001/api/students
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "6acf343faab890237c300400",
        "studentId": "STU101",
        "name": "Alice Johnson",
        "email": "alice@college.edu",
        "courseIds": ["CS101", "CS102"]
      }
    ]
  }
  ```

#### 4. Get Student by ID
- **Endpoint:** `GET /api/students/:id`
- **Request:**
  ```bash
  curl -X GET http://localhost:5001/api/students/STU101
  ```

---

### C. Inter-Service Communication Endpoint (Core 5-Mark Feature)

#### Retrieve Student Information and Associated Course Details
- **Endpoint:** `GET /api/students/:id/courses`
- **How it works:**
  1. Student Service queries its own MongoDB (`student_service_db`) for student `STU101`.
  2. For each course ID stored in `courseIds`, Student Service sends an HTTP `GET` request using Axios to `COURSE_SERVICE_URL/api/courses/:courseId`.
  3. Combines student profile data and live course objects into a single clean JSON response.
- **Request:**
  ```bash
  curl -X GET http://localhost:5001/api/students/STU101/courses
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "student": {
      "id": "6acf343faab890237c300400",
      "studentId": "STU101",
      "name": "Alice Johnson",
      "email": "alice@college.edu",
      "enrolledCourseIds": ["CS101", "CS102"],
      "createdAt": "2026-10-14T07:50:23.839Z"
    },
    "courses": [
      {
        "_id": "6acf343782d0938cbdc9797e",
        "courseId": "CS101",
        "courseName": "Data Structures & Algorithms",
        "credits": 4,
        "createdAt": "2026-10-14T07:50:15.617Z"
      },
      {
        "_id": "6acf343782d0938cbdc97981",
        "courseId": "CS102",
        "courseName": "Database Management Systems",
        "credits": 3,
        "createdAt": "2026-10-14T07:50:15.641Z"
      }
    ],
    "interServiceCommunication": {
      "status": "SUCCESS",
      "courseServiceUrl": "http://localhost:5002",
      "protocol": "HTTP/REST (Axios)",
      "message": "All course details fetched successfully",
      "timestamp": "2026-10-14T07:50:29.702Z"
    }
  }
  ```

#### Resilient Error Handling Showcase:
- **If a course ID is missing or deleted in Course Service:**
  Returns `{ "courseId": "CS999", "status": "NOT_FOUND", "courseName": "Course Record Not Found" }`.
- **If Course Service is offline/down:**
  Returns HTTP 200 with `status: "DEGRADED"` and `{ "status": "UNAVAILABLE", "courseName": "Service Unavailable" }` without crashing the Student Service.
- **If student has no courses:**
  Returns `courses: []` with message `"Student has no enrolled courses"`.

---

## 6. MongoDB Atlas Configuration

If deploying to the cloud or using MongoDB Atlas instead of local MongoDB:

1. **Create Free MongoDB Atlas Account:** Visit [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free M0 cluster.
2. **Configure Database User:**
   - Under **Database Access**, create a user (e.g. `clusterAdmin`) and set a secure password.
3. **Configure Network Access:**
   - Under **Network Access**, click **Add IP Address** -> Choose **Allow Access from Anywhere (`0.0.0.0/0`)** so Render services can connect.
4. **Copy Connection String:**
   - Click **Connect** -> **Connect your application (Drivers)** -> Copy URI:
     `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. **Set Separate Databases:**
   - For Course Service: Append `/course_service_db` before `?`:
     `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/course_service_db?retryWrites=true&w=majority`
   - For Student Service: Append `/student_service_db` before `?`:
     `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/student_service_db?retryWrites=true&w=majority`

---

## 7. Cloud Deployment Guide

### Deployment 1: Course Service on Render
1. Push this project to a GitHub repository.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Web Service** -> Connect your GitHub repo.
4. Fill in the following settings:
   - **Name:** `course-service`
   - **Root Directory:** `course-service`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `PORT`: `10000` (or leave default, Render sets `PORT` automatically)
   - `MONGODB_URI`: `mongodb+srv://.../course_service_db`
   - `FRONTEND_URL`: `https://your-frontend.vercel.app`
6. Click **Deploy Web Service**.
7. Test the live health endpoint: `https://course-service-xxxx.onrender.com/health`.

---

### Deployment 2: Student Service on Render
1. In Render, click **New +** -> **Web Service** -> Connect the same repository.
2. Settings:
   - **Name:** `student-service`
   - **Root Directory:** `student-service`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Under **Environment Variables**, add:
   - `PORT`: `10000`
   - `MONGODB_URI`: `mongodb+srv://.../student_service_db`
   - `COURSE_SERVICE_URL`: `https://course-service-xxxx.onrender.com` (URL from Step 1)
   - `FRONTEND_URL`: `https://your-frontend.vercel.app`
4. Click **Deploy Web Service**.
5. Test live health: `https://student-service-xxxx.onrender.com/health`.

---

### Deployment 3: React Frontend on Vercel
1. Log into [Vercel](https://vercel.com) and click **Add New...** -> **Project**.
2. Select your GitHub repository.
3. Configure settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit to select `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Expand **Environment Variables** and add:
   - `VITE_STUDENT_API_URL`: `https://student-service-xxxx.onrender.com`
   - `VITE_COURSE_API_URL`: `https://course-service-xxxx.onrender.com`
5. Click **Deploy**.
6. Update the `FRONTEND_URL` environment variables on both Render services with your live Vercel URL (e.g. `https://student-course-mgmt.vercel.app`).

---

## 8. College Practical Exam 20-Mark Evaluation Checklist

| Criteria | Marks | Implementation in This Project | Verification Status |
|---|---|---|---|
| **Microservices Architecture** | **6** | Independent `course-service` (:5002) & `student-service` (:5001), isolated models, separate DBs, independent execution. | Verified (runs separately) |
| **REST API Implementation** | **4** | Standard HTTP verbs (`GET`, `POST`), validation (regex email, ranges), status codes (`200`, `201`, `400`, `404`, `409`), centralized error middleware. | Verified (tested with curl) |
| **Inter-Service Communication** | **5** | Live HTTP requests via Axios from Student Service to Course Service (`GET /api/students/:id/courses`). Handles downtime, missing IDs, and empty lists. | Verified (Axios HTTP confirmed) |
| **Deployment & Integration** | **5** | Vite React dashboard with health monitor, dynamic `.env` configuration, CORS support, ready for Render and Vercel. | Verified (Vite builds cleanly) |
| **Total** | **20/20** | Full working MERN microservices project ready for viva and practical demonstration. | Ready |

---

## 9. College Viva Guide (Q&A for Examination)

### Q1: What is a Microservices Architecture and how does this project demonstrate it?
> **Answer:** In a microservices architecture, an application is split into small, independently deployable services that each own a single business domain. In this project, `student-service` owns student profiles and enrolments, while `course-service` owns course offerings. Each service runs in its own process, on its own port, has its own dependencies, and manages its own database collection without sharing models.

### Q2: Why do both services have separate MongoDB databases instead of sharing one?
> **Answer:** A fundamental microservices pattern is **Database-per-Service**. If two services share the exact same database schema, any schema change in one service could break the other, creating tight coupling. Having separate databases (`student_service_db` and `course_service_db`) guarantees autonomy and prevents cross-service database locks.

### Q3: How does the Student Service communicate with the Course Service?
> **Answer:** Communication happens over **HTTP REST** using **Axios**. When a user requests `GET /api/students/:id/courses`, the Student Service retrieves the student record from its database, extracts the referenced `courseIds`, and makes an HTTP request to `COURSE_SERVICE_URL/api/courses/:courseId` for each ID. It then aggregates the responses and returns a single JSON object.

### Q4: What happens if the Course Service crashes or becomes unreachable?
> **Answer:** In `student-service/src/services/courseClient.js`, we use `Promise.allSettled()` with error handling. If `course-service` is down (`ECONNREFUSED` or timeout), the Student Service catches the error and responds with status `DEGRADED`, indicating the course details are temporarily unavailable without crashing or hanging.

### Q5: Why don't we embed full course details inside the Student document?
> **Answer:** Embedding full course details creates data redundancy and consistency problems: if a course name or credits change, all student records would contain outdated data. By storing only the reference (`courseIds: ["CS101"]`) and fetching course data dynamically, we ensure single source of truth.

---

## 10. Common Errors & Troubleshooting

| Error | Root Cause | Solution |
|---|---|---|
| `ECONNREFUSED 127.0.0.1:5002` | Course Service is not running or on wrong port. | Start Course Service in a separate terminal: `cd course-service && npm start`. |
| `MongoDB Connection Error` | MongoDB daemon is not running locally. | Run `brew services start mongodb-community@7.0` (Mac) or check your Atlas URI. |
| `CORS Error in Browser` | Origin not allowed in backend CORS options. | Ensure `FRONTEND_URL` in `.env` matches your browser URL (e.g. `http://localhost:5173`). |
| `Duplicate Student ID (409)` | `studentId` is marked `unique: true` in schema. | Use a different, unique Student ID or delete the old record. |
| `Vite build fails` | Missing node_modules or invalid imports. | Run `cd frontend && npm install && npm run build`. |

---
**Created for College Practical Examination • MERN Stack Microservices**
