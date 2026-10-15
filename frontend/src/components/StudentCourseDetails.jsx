import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  BookOpen,
  User,
  AlertTriangle,
  CheckCircle2,
  Code2,
  ArrowRight,
  Info
} from 'lucide-react';
import { fetchStudentCoursesApi, getErrorMessage } from '../services/api';

export default function StudentCourseDetails({
  students,
  selectedStudentId,
  onSelectStudentId
}) {
  const [currentId, setCurrentId] = useState(selectedStudentId || '');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);

  // Sync when prop changes
  useEffect(() => {
    if (selectedStudentId) {
      setCurrentId(selectedStudentId);
      loadDetails(selectedStudentId);
    }
  }, [selectedStudentId]);

  const loadDetails = async (idToFetch) => {
    const id = idToFetch || currentId;
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetchStudentCoursesApi(id);
      setData(res);
    } catch (err) {
      setData(null);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownChange = (e) => {
    const val = e.target.value;
    setCurrentId(val);
    if (onSelectStudentId) onSelectStudentId(val);
    if (val) {
      loadDetails(val);
    } else {
      setData(null);
    }
  };

  return (
    <div>
      {/* Microservice Communication Flow Callout */}
      <div className="arch-callout">
        <div className="arch-header">
          <Layers size={22} color="#a5b4fc" />
          <h2>Microservices Inter-Service Communication Flow</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#c7d2fe', lineHeight: 1.6 }}>
          This view demonstrates genuine HTTP REST communication across services. When you select a student,
          the frontend calls the <strong>Student Service</strong> endpoint <code>/api/students/:id/courses</code>.
          The Student Service then calls the <strong>Course Service</strong> via <code>Axios HTTP</code> at
          <code>COURSE_SERVICE_URL</code> to retrieve full course details and returns the combined response.
        </p>

        <div className="arch-flow-diagram">
          <div className="arch-node">
            <div>React Frontend</div>
            <small style={{ color: '#cbd5e1' }}>Port 5173</small>
          </div>
          <div className="arch-arrow">
            ── GET /api/students/:id/courses ──►
          </div>
          <div className="arch-node" style={{ borderColor: '#818cf8' }}>
            <div>Student Service</div>
            <small style={{ color: '#cbd5e1' }}>Port 5005 (Owner of Students)</small>
          </div>
          <div className="arch-arrow">
            ── Axios HTTP GET /api/courses/:id ──►
          </div>
          <div className="arch-node" style={{ borderColor: '#38bdf8' }}>
            <div>Course Service</div>
            <small style={{ color: '#cbd5e1' }}>Port 5006 (Owner of Courses)</small>
          </div>
        </div>
      </div>

      {/* Student Selector Card */}
      <div className="panel-card" style={{ marginBottom: 24 }}>
        <div className="panel-header">
          <h2>
            <Search size={20} color="var(--primary)" />
            Select Student for Combined Record
          </h2>
        </div>
        <div className="panel-body">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <select
                className="form-input"
                value={currentId}
                onChange={handleDropdownChange}
              >
                <option value="">-- Choose a student to query --</option>
                {students.map((s) => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.studentId} — {s.name} ({s.courseIds?.length || 0} course references)
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => loadDetails()}
              disabled={loading || !currentId}
            >
              <Search size={16} />
              <span>{loading ? 'Fetching...' : 'Query Inter-Service API'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="panel-card" style={{ padding: 40, textAlign: 'center' }}>
          <div className="pulse-dot" style={{ width: 16, height: 16, margin: '0 auto 16px', backgroundColor: 'var(--primary)' }}></div>
          <p style={{ fontWeight: 600 }}>Contacting Student Service and querying Course Service...</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Executing inter-service HTTP request</p>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-error">
          <AlertTriangle size={20} />
          <div>
            <strong>Error Querying Inter-Service Endpoint:</strong>
            <p style={{ marginTop: 4 }}>{error}</p>
          </div>
        </div>
      )}

      {/* Combined Results Display */}
      {data && !loading && (
        <div>
          {/* Metadata banner */}
          <div
            className={`alert ${
              data.interServiceCommunication?.status === 'SUCCESS' ? 'alert-success' : 'alert-info'
            }`}
          >
            <CheckCircle2 size={20} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <strong>Inter-Service Communication Status: {data.interServiceCommunication?.status}</strong>
                <span className="badge badge-gray">Protocol: {data.interServiceCommunication?.protocol}</span>
              </div>
              <p style={{ marginTop: 4, fontSize: '0.82rem' }}>
                Target: <code>{data.interServiceCommunication?.courseServiceUrl}</code> • {data.interServiceCommunication?.message}
              </p>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="details-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.05rem', color: 'var(--text-main)' }}>
              <User size={20} color="var(--primary)" />
              Student Profile (from Student DB)
            </h3>
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-label">Student ID</div>
                <div className="detail-value">{data.student?.studentId}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Full Name</div>
                <div className="detail-value">{data.student?.name}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Email Address</div>
                <div className="detail-value">{data.student?.email}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Referenced Course IDs</div>
                <div className="detail-value">
                  {data.student?.enrolledCourseIds?.length > 0 ? (
                    data.student.enrolledCourseIds.join(', ')
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>None</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Associated Courses Cards */}
          <div className="panel-card" style={{ marginBottom: 24 }}>
            <div className="panel-header">
              <h2>
                <BookOpen size={20} color="var(--primary)" />
                Resolved Course Details ({data.courses?.length || 0})
              </h2>
              <span className="badge badge-primary">Retrieved from Course Service</span>
            </div>

            <div className="panel-body">
              {(!data.courses || data.courses.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                  <Info size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                  <p>This student is not enrolled in any courses yet.</p>
                </div>
              ) : (
                <div className="course-cards-grid">
                  {data.courses.map((course, idx) => {
                    const isUnavailable = course.status === 'UNAVAILABLE';
                    const isNotFound = course.status === 'NOT_FOUND';

                    let cardClass = 'course-card-item';
                    if (isUnavailable) cardClass += ' unavailable';
                    if (isNotFound) cardClass += ' not-found';

                    return (
                      <div key={course.courseId || idx} className={cardClass}>
                        <div>
                          <div className="course-card-header">
                            <span className="course-code">{course.courseId}</span>
                            <span className="course-credits-badge">
                              {course.credits} Credits
                            </span>
                          </div>
                          <div className="course-title">{course.courseName}</div>
                        </div>

                        {course.error && (
                          <div style={{ fontSize: '0.75rem', color: '#991b1b', marginTop: 8 }}>
                            ⚠️ {course.error}
                          </div>
                        )}

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid #f1f5f9', paddingTop: 8, marginTop: 8 }}>
                          Source: Course Service Database
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Collapsible Raw JSON Response for Viva/Evaluator */}
          <div className="panel-card">
            <div
              className="panel-header"
              style={{ cursor: 'pointer', background: '#f8fafc' }}
              onClick={() => setShowRawJson(!showRawJson)}
            >
              <h2>
                <Code2 size={18} color="var(--text-muted)" />
                Raw Inter-Service JSON Response (Click to {showRawJson ? 'Hide' : 'Inspect'})
              </h2>
              <span className="badge badge-gray">{showRawJson ? 'Collapse' : 'Expand'}</span>
            </div>
            {showRawJson && (
              <div className="panel-body" style={{ background: '#0f172a', color: '#f8fafc' }}>
                <pre style={{ overflowX: 'auto', fontSize: '0.8rem', lineHeight: 1.4 }}>
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
