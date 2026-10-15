import axios from 'axios';

/**
 * Course Service HTTP Client
 * Used for inter-service communication over REST API (Axios).
 * NEVER import Course model or direct DB connection here.
 */
const getCourseServiceClient = () => {
  const baseURL = process.env.COURSE_SERVICE_URL || 'http://localhost:5006';
  return axios.create({
    baseURL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
      'X-Caller-Service': 'student-service'
    }
  });
};

/**
 * Fetch a single course by courseId from Course Service
 * @param {string} courseId
 * @returns {Promise<Object>} Course details
 */
export const fetchCourseById = async (courseId) => {
  const client = getCourseServiceClient();
  try {
    const response = await client.get(`/api/courses/${encodeURIComponent(courseId)}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {
        success: false,
        status: 404,
        courseId,
        message: `Course '${courseId}' not found in Course Service`
      };
    }

    // Network / connection error (e.g., Course Service is down)
    return {
      success: false,
      status: error.response?.status || 503,
      courseId,
      isServiceDown: !error.response,
      message: error.message || 'Course Service communication failed'
    };
  }
};

/**
 * Fetch multiple courses in parallel for a given list of course IDs
 * @param {string[]} courseIds
 * @returns {Promise<Object>} Aggregated courses with status metadata
 */
export const fetchMultipleCourses = async (courseIds = []) => {
  if (!courseIds || courseIds.length === 0) {
    return {
      courses: [],
      courseServiceAvailable: true,
      message: 'Student has no enrolled courses'
    };
  }

  const results = await Promise.allSettled(
    courseIds.map((cid) => fetchCourseById(cid))
  );

  const resolvedCourses = [];
  let serviceDownDetected = false;

  for (const res of results) {
    if (res.status === 'fulfilled') {
      const outcome = res.value;
      if (outcome.success) {
        resolvedCourses.push(outcome.data);
      } else if (outcome.isServiceDown) {
        serviceDownDetected = true;
        resolvedCourses.push({
          courseId: outcome.courseId,
          courseName: 'Service Unavailable',
          credits: 0,
          status: 'UNAVAILABLE',
          error: outcome.message
        });
      } else {
        // Course ID not found in Course Service
        resolvedCourses.push({
          courseId: outcome.courseId,
          courseName: 'Course Record Not Found',
          credits: 0,
          status: 'NOT_FOUND',
          error: outcome.message
        });
      }
    } else {
      serviceDownDetected = true;
      resolvedCourses.push({
        courseId: 'UNKNOWN',
        courseName: 'Request Failed',
        credits: 0,
        status: 'ERROR',
        error: res.reason?.message || 'Failed to query course'
      });
    }
  }

  return {
    courses: resolvedCourses,
    courseServiceAvailable: !serviceDownDetected,
    message: serviceDownDetected
      ? 'Course Service was partially or completely unavailable during fetch'
      : 'All course details fetched successfully'
  };
};
