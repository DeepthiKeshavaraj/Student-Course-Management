import axios from 'axios';

// Backend Base URLs from environment variables
const STUDENT_API_BASE = import.meta.env.VITE_STUDENT_API_URL || 'http://localhost:5001';
const COURSE_API_BASE = import.meta.env.VITE_COURSE_API_URL || 'http://localhost:5002';

// Create Axios instances
export const studentApi = axios.create({
  baseURL: STUDENT_API_BASE,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const courseApi = axios.create({
  baseURL: COURSE_API_BASE,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper for error message formatting
export const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please verify service availability.';
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected network error occurred';
};

// ================= COURSE SERVICE APIS ================= //

export const fetchAllCourses = async () => {
  const res = await courseApi.get('/api/courses');
  return res.data;
};

export const createCourseApi = async (courseData) => {
  const res = await courseApi.post('/api/courses', courseData);
  return res.data;
};

export const fetchCourseHealth = async () => {
  try {
    const res = await courseApi.get('/health', { timeout: 3000 });
    return { online: true, data: res.data };
  } catch (err) {
    return { online: false, error: err.message };
  }
};

// ================= STUDENT SERVICE APIS ================= //

export const fetchAllStudents = async () => {
  const res = await studentApi.get('/api/students');
  return res.data;
};

export const createStudentApi = async (studentData) => {
  const res = await studentApi.post('/api/students', studentData);
  return res.data;
};

export const fetchStudentById = async (id) => {
  const res = await studentApi.get(`/api/students/${id}`);
  return res.data;
};

/**
 * Live Inter-Service Communication API:
 * Calls Student Service endpoint /api/students/:id/courses,
 * which calls Course Service behind the scenes and returns combined JSON.
 */
export const fetchStudentCoursesApi = async (studentId) => {
  const res = await studentApi.get(`/api/students/${studentId}/courses`);
  return res.data;
};

export const fetchStudentHealth = async () => {
  try {
    const res = await studentApi.get('/health', { timeout: 3000 });
    return { online: true, data: res.data };
  } catch (err) {
    return { online: false, error: err.message };
  }
};
