import express from 'express';
import {
  createCourse,
  getCourses,
  getCourseById
} from '../controllers/courseController.js';

const router = express.Router();

router.route('/')
  .post(createCourse)
  .get(getCourses);

router.route('/:id')
  .get(getCourseById);

export default router;
