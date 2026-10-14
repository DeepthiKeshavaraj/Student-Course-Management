import mongoose from 'mongoose';
import Student from '../models/Student.js';
import { fetchMultipleCourses } from '../services/courseClient.js';

/**
 * Helper to find student by studentId or MongoDB _id
 */
const findStudentByIdOrIdString = async (identifier) => {
  const lookup = String(identifier).trim();
  let student = await Student.findOne({ studentId: lookup.toUpperCase() });

  if (!student && mongoose.Types.ObjectId.isValid(lookup)) {
    student = await Student.findById(lookup);
  }

  return student;
};

/**
 * @desc    Create a new student
 * @route   POST /api/students
 * @access  Public
 */
export const createStudent = async (req, res, next) => {
  try {
    const { studentId, name, email, courseIds } = req.body;

    // Validation
    if (!studentId || !name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentId, name, and email'
      });
    }

    const trimmedStudentId = String(studentId).trim().toUpperCase();
    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check duplicate studentId
    const existing = await Student.findOne({ studentId: trimmedStudentId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Student with Student ID '${trimmedStudentId}' already exists`
      });
    }

    // Sanitize courseIds (allow array or comma-separated string)
    let parsedCourseIds = [];
    if (Array.isArray(courseIds)) {
      parsedCourseIds = courseIds
        .map((c) => String(c).trim().toUpperCase())
        .filter(Boolean);
    } else if (typeof courseIds === 'string' && courseIds.trim() !== '') {
      parsedCourseIds = courseIds
        .split(',')
        .map((c) => c.trim().toUpperCase())
        .filter(Boolean);
    }
    // Deduplicate course IDs
    parsedCourseIds = [...new Set(parsedCourseIds)];

    const student = await Student.create({
      studentId: trimmedStudentId,
      name: trimmedName,
      email: trimmedEmail,
      courseIds: parsedCourseIds
    });

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: student
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate Student ID detected'
      });
    }
    next(error);
  }
};

/**
 * @desc    Get all students
 * @route   GET /api/students
 * @access  Public
 */
export const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single student by studentId or _id
 * @route   GET /api/students/:id
 * @access  Public
 */
export const getStudentById = async (req, res, next) => {
  try {
    const student = await findStudentByIdOrIdString(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID '${req.params.id}'`
      });
    }

    return res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    INTER-SERVICE COMMUNICATION ENDPOINT
 *          Retrieves student details from Student DB and calls Course Service
 *          over HTTP to fetch the associated course details.
 * @route   GET /api/students/:id/courses
 * @access  Public
 */
export const getStudentCourses = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await findStudentByIdOrIdString(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID '${id}'`
      });
    }

    const courseServiceUrl = process.env.COURSE_SERVICE_URL || 'http://localhost:5002';

    // Inter-Service Call: Request course details from Course Service
    const courseResult = await fetchMultipleCourses(student.courseIds);

    return res.status(200).json({
      success: true,
      student: {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        enrolledCourseIds: student.courseIds,
        createdAt: student.createdAt
      },
      courses: courseResult.courses,
      interServiceCommunication: {
        status: courseResult.courseServiceAvailable ? 'SUCCESS' : 'DEGRADED',
        courseServiceUrl,
        protocol: 'HTTP/REST (Axios)',
        message: courseResult.message,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
