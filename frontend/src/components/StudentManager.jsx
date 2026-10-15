import React, { useState } from 'react';
import { Users, UserPlus, AlertCircle, CheckCircle2, RefreshCw, ExternalLink } from 'lucide-react';
import { createStudentApi, getErrorMessage } from '../services/api';

export default function StudentManager({
  students,
  courses,
  isLoading,
  onRefreshStudents,
  onViewStudentCourses
}) {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleCourseToggle = (cId) => {
    setSelectedCourseIds((prev) =>
      prev.includes(cId) ? prev.filter((id) => id !== cId) : [...prev, cId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    // Validation
    if (!studentId.trim() || !name.trim() || !email.trim()) {
      setAlert({ type: 'error', message: 'Student ID, Name, and Email are required.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setAlert({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    try {
      setSubmitting(true);
      await createStudentApi({
        studentId: studentId.trim().toUpperCase(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        courseIds: selectedCourseIds
      });

      setAlert({
        type: 'success',
        message: `Student '${name.trim()}' (${studentId.trim().toUpperCase()}) registered successfully!`
      });

      // Reset form
      setStudentId('');
      setName('');
      setEmail('');
      setSelectedCourseIds([]);

      // Refresh student list
      onRefreshStudents();
    } catch (err) {
      setAlert({ type: 'error', message: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="view-grid">
      {/* Add Student Form Panel */}
      <div className="panel-card">
        <div className="panel-header">
          <h2>
            <UserPlus size={20} color="var(--primary)" />
            Add New Student
          </h2>
          <span className="badge badge-gray">Student Service (:5005)</span>
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
              <label htmlFor="studentId">Student ID *</label>
              <input
                id="studentId"
                type="text"
                className="form-input"
                placeholder="e.g. STU101, CS2026-01"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                disabled={submitting}
              />
              <span className="form-error" style={{ color: '#64748b' }}>
                Unique registration or roll number
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="e.g. Alice Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="e.g. alice@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label>Select Enrolled Courses (Optional)</label>
              {courses.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  No courses found in Course Service. You can still create a student, or add courses in the Courses tab first.
                </p>
              ) : (
                <div className="course-checkbox-list">
                  {courses.map((course) => {
                    const isChecked = selectedCourseIds.includes(course.courseId);
                    return (
                      <label key={course.courseId} className="course-check-item">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleCourseToggle(course.courseId)}
                          disabled={submitting}
                        />
                        <span>
                          <strong>{course.courseId}</strong> — {course.courseName} ({course.credits} cr)
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={submitting}
            >
              {submitting ? 'Registering Student...' : 'Register Student'}
            </button>
          </form>
        </div>
      </div>

      {/* Students List Table Panel */}
      <div className="panel-card">
        <div className="panel-header">
          <h2>
            <Users size={20} color="var(--primary)" />
            Enrolled Students ({students.length})
          </h2>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onRefreshStudents}
            disabled={isLoading}
          >
            <RefreshCw size={14} className={isLoading ? 'pulse-dot' : ''} />
            <span>{isLoading ? 'Updating...' : 'Refresh List'}</span>
          </button>
        </div>

        <div className="panel-body" style={{ padding: 0 }}>
          {students.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>No students enrolled yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                Fill out the form on the left to add a student.
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course References</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((stu) => (
                    <tr key={stu._id || stu.studentId}>
                      <td>
                        <span className="badge badge-primary">{stu.studentId}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{stu.name}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>{stu.email}</td>
                      <td>
                        {stu.courseIds && stu.courseIds.length > 0 ? (
                          stu.courseIds.map((cid) => (
                            <span key={cid} className="badge-tag">
                              {cid}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            None
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onViewStudentCourses(stu.studentId)}
                          title="View live combined courses via Inter-Service API"
                        >
                          <ExternalLink size={13} />
                          <span>Inter-Service View</span>
                        </button>
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
