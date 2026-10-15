import React, { useState } from 'react';
import { BookOpen, PlusCircle, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { createCourseApi, getErrorMessage } from '../services/api';

export default function CourseManager({
  courses,
  isLoading,
  onRefreshCourses
}) {
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [credits, setCredits] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: string }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    // Frontend validation
    if (!courseId.trim() || !courseName.trim() || !credits) {
      setAlert({ type: 'error', message: 'All course fields are required.' });
      return;
    }

    const numCredits = Number(credits);
    if (isNaN(numCredits) || numCredits < 1 || numCredits > 10) {
      setAlert({ type: 'error', message: 'Credits must be a number between 1 and 10.' });
      return;
    }

    try {
      setSubmitting(true);
      await createCourseApi({
        courseId: courseId.trim().toUpperCase(),
        courseName: courseName.trim(),
        credits: numCredits
      });

      setAlert({
        type: 'success',
        message: `Course '${courseId.trim().toUpperCase()}' added successfully to Course Service!`
      });

      // Reset form
      setCourseId('');
      setCourseName('');
      setCredits('');

      // Refresh list
      onRefreshCourses();
    } catch (err) {
      setAlert({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="view-grid">
      {/* Add Course Form Panel */}
      <div className="panel-card">
        <div className="panel-header">
          <h2>
            <PlusCircle size={20} color="var(--primary)" />
            Add New Course
          </h2>
          <span className="badge badge-gray">Course Service (:5006)</span>
        </div>

        <div className="panel-body">
          {alert && (
            <div className={`alert alert-${alert.type}`}>
              {alert.type === 'success' ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span>{alert.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="courseId">Course ID *</label>
              <input
                id="courseId"
                type="text"
                className="form-input"
                placeholder="e.g. CS101, MAT202"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value.toUpperCase())}
                disabled={submitting}
              />
              <span className="form-error" style={{ color: '#64748b' }}>
                Unique code for the course
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="courseName">Course Name *</label>
              <input
                id="courseName"
                type="text"
                className="form-input"
                placeholder="e.g. Data Structures & Algorithms"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="credits">Credits (1–10) *</label>
              <input
                id="credits"
                type="number"
                min="1"
                max="10"
                className="form-input"
                placeholder="e.g. 4"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={submitting}
            >
              {submitting ? 'Creating Course...' : 'Add Course'}
            </button>
          </form>
        </div>
      </div>

      {/* Courses List Table Panel */}
      <div className="panel-card">
        <div className="panel-header">
          <h2>
            <BookOpen size={20} color="var(--primary)" />
            Available Courses ({courses.length})
          </h2>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onRefreshCourses}
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? 'pulse-dot' : ''} />
            <span>{isLoading ? 'Updating...' : 'Refresh List'}</span>
          </button>
        </div>

        <div className="panel-body" style={{ padding: 0 }}>
          {courses.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <BookOpen size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>No courses registered yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                Use the form on the left to add your first course.
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Course Name</th>
                    <th>Credits</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id || course.courseId}>
                      <td>
                        <span className="badge badge-primary">{course.courseId}</span>
                      </td>
                      <td style={{ fontWeight: 500 }}>{course.courseName}</td>
                      <td>
                        <span className="badge badge-gray">{course.credits} Credits</span>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
