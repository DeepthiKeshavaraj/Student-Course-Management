import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import studentRoutes from './routes/studentRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const COURSE_SERVICE_URL = process.env.COURSE_SERVICE_URL || 'http://localhost:5002';

// Connect to MongoDB
connectDB();

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev/testing for smooth college viva evaluations
  },
  credentials: true
}));

app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'student-service',
    status: 'UP',
    port: PORT,
    courseServiceUrl: COURSE_SERVICE_URL,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/students', studentRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Student Microservice is running',
    healthCheck: '/health',
    interServiceTarget: COURSE_SERVICE_URL,
    endpoints: {
      getAllStudents: 'GET /api/students',
      createStudent: 'POST /api/students',
      getStudentById: 'GET /api/students/:id',
      getStudentCourses: 'GET /api/students/:id/courses (Inter-Service)'
    }
  });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Student Service Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[Student Service] Running on port ${PORT} (http://localhost:${PORT})`);
  console.log(`[Student Service] Target Course Service: ${COURSE_SERVICE_URL}`);
});
