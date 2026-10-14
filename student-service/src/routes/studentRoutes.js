import express from 'express';
import {
  createStudent,
  getStudents,
  getStudentById,
  getStudentCourses
} from '../controllers/studentController.js';

const router = express.Router();

router.route('/')
  .post(createStudent)
  .get(getStudents);

// Specific sub-resource route must come before /:id to avoid path conflicts
router.route('/:id/courses')
  .get(getStudentCourses);

router.route('/:id')
  .get(getStudentById);

export default router;
