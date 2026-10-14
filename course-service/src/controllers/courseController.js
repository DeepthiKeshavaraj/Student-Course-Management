import mongoose from 'mongoose';
import Course from '../models/Course.js';

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Public
 */
export const createCourse = async (req, res, next) => {
  try {
    const { courseId, courseName, credits } = req.body;

    // Input validation
    if (!courseId || !courseName || credits === undefined || credits === null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide courseId, courseName, and credits'
      });
    }

    const trimmedCourseId = String(courseId).trim().toUpperCase();
    const parsedCredits = Number(credits);

    if (isNaN(parsedCredits) || parsedCredits < 1 || parsedCredits > 10) {
      return res.status(400).json({
        success: false,
        message: 'Credits must be a valid number between 1 and 10'
      });
    }

    // Check for duplicate Course ID
    const existingCourse = await Course.findOne({ courseId: trimmedCourseId });
    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: `Course with Course ID '${trimmedCourseId}' already exists`
      });
    }

    const course = await Course.create({
      courseId: trimmedCourseId,
      courseName: courseName.trim(),
      credits: parsedCredits
    });

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    // Handle MongoDB duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate Course ID detected'
      });
    }
    next(error);
  }
};

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Public
 */
export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get course by courseId or MongoDB _id
 * @route   GET /api/courses/:id
 * @access  Public
 */
export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lookupId = id.trim();

    let course = null;

    // 1. Try finding by courseId (e.g. CS101)
    course = await Course.findOne({ courseId: lookupId.toUpperCase() });

    // 2. If not found and valid ObjectId, try finding by MongoDB _id
    if (!course && mongoose.Types.ObjectId.isValid(lookupId)) {
      course = await Course.findById(lookupId);
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course not found with ID '${id}'`
      });
    }

    return res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};
