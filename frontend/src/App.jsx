import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StudentManager from './components/StudentManager';
import CourseManager from './components/CourseManager';
import StudentCourseDetails from './components/StudentCourseDetails';
import {
  fetchAllStudents,
  fetchAllCourses,
  fetchStudentHealth,
  fetchCourseHealth
} from './services/api';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  GraduationCap,
  Server,
  ArrowRight,
  Database
} from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'students' | 'courses' | 'details'
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentHealth, setStudentHealth] = useState({ online: false });
  const [courseHealth, setCourseHealth] = useState({ online: false });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Fetch all health statuses
  const checkHealth = useCallback(async () => {
    const [sHealth, cHealth] = await Promise.all([
      fetchStudentHealth(),
      fetchCourseHealth()
    ]);
    setStudentHealth(sHealth);
    setCourseHealth(cHealth);
  }, []);

  // Fetch all data
  const loadAllData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await checkHealth();

      const [stuRes, crsRes] = await Promise.allSettled([
        fetchAllStudents(),
        fetchAllCourses()
      ]);

      if (stuRes.status === 'fulfilled' && stuRes.value.success) {
        setStudents(stuRes.value.data || []);
      }
      if (crsRes.status === 'fulfilled' && crsRes.value.success) {
        setCourses(crsRes.value.data || []);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [checkHealth]);

  // Initial load
  useEffect(() => {
    loadAllData();
    // Periodic health check every 15 seconds
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, [loadAllData, checkHealth]);

  // Handle navigate to Inter-Service Details tab with pre-selected student
  const handleViewStudentCourses = (studentId) => {
    setSelectedStudentId(studentId);
    setActiveTab('details');
  };

  return (
    <div className="app-container">
      {/* Header & Service Status */}
      <Navbar
        studentHealth={studentHealth}
        courseHealth={courseHealth}
        onRefreshAll={loadAllData}
        isRefreshing={isRefreshing}
      />

      <main className="main-content">
        {/* Navigation Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={18} />
            <span>Overview & Architecture</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <Users size={18} />
            <span>Students ({students.length})</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={18} />
            <span>Courses ({courses.length})</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <Layers size={18} />
            <span>Student–Course Details (Inter-Service)</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div>
            {/* Quick Metrics */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon-box" style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }}>
                  <Users size={24} />
                </div>
                <div className="metric-info">
                  <h3>Total Enrolled Students</h3>
                  <div className="metric-value">{students.length}</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon-box" style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' }}>
                  <BookOpen size={24} />
                </div>
                <div className="metric-info">
                  <h3>Total Courses Offered</h3>
                  <div className="metric-value">{courses.length}</div>
                </div>
              </div>

              <div className="metric-card">
                <div
                  className="metric-icon-box"
                  style={{
                    background: studentHealth.online && courseHealth.online
                      ? 'linear-gradient(135deg, #10b981, #34d399)'
                      : 'linear-gradient(135deg, #f59e0b, #fbbf24)'
                  }}
                >
                  <Server size={24} />
                </div>
                <div className="metric-info">
                  <h3>Microservices Status</h3>
                  <div className="metric-value" style={{ fontSize: '1.25rem' }}>
                    {studentHealth.online && courseHealth.online
                      ? '2/2 Online'
                      : `${Number(studentHealth.online) + Number(courseHealth.online)}/2 Online`}
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Explanatory Callout */}
            <div className="arch-callout">
              <div className="arch-header">
                <GraduationCap size={24} color="#a5b4fc" />
                <h2>MERN Microservices System Architecture (College Evaluation Guide)</h2>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#e0e7ff', lineHeight: 1.6, maxWidth: 900 }}>
                This project demonstrates the core principles of <strong>microservices architecture</strong>:
                independent services, separate database ownership, decentralized data management, and genuine HTTP inter-service communication.
              </p>

              <div className="arch-flow-diagram">
                <div className="arch-node">
                  <div style={{ fontWeight: 700 }}>React + Vite</div>
                  <small style={{ color: '#cbd5e1' }}>Port 5175 (Vercel Ready)</small>
                </div>
                <div className="arch-arrow">
                  ── REST API ──►
                </div>
                <div className="arch-node" style={{ borderColor: '#818cf8', background: 'rgba(99, 102, 241, 0.25)' }}>
                  <div style={{ fontWeight: 700 }}>Student Service</div>
                  <small style={{ color: '#cbd5e1' }}>Port 5005 • Node/Express</small>
                  <div style={{ fontSize: '0.72rem', marginTop: 4, color: '#a5b4fc' }}>
                    <Database size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                    DB: student_service_db
                  </div>
                </div>
                <div className="arch-arrow">
                  ── Axios HTTP GET ──►
                </div>
                <div className="arch-node" style={{ borderColor: '#38bdf8', background: 'rgba(14, 165, 233, 0.25)' }}>
                  <div style={{ fontWeight: 700 }}>Course Service</div>
                  <small style={{ color: '#cbd5e1' }}>Port 5006 • Node/Express</small>
                  <div style={{ fontSize: '0.72rem', marginTop: 4, color: '#7dd3fc' }}>
                    <Database size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                    DB: course_service_db
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="panel-card">
              <div className="panel-header">
                <h2>Quick Actions & Demonstration Shortcuts</h2>
              </div>
              <div className="panel-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                  <div style={{ border: '1px solid var(--border)', padding: 18, borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--primary)' }}>
                      <BookOpen size={18} />
                      1. Manage Courses
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                      Create courses in the independent Course Service running on port 5006.
                    </p>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('courses')}>
                      Go to Courses <ArrowRight size={14} />
                    </button>
                  </div>

                  <div style={{ border: '1px solid var(--border)', padding: 18, borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--primary)' }}>
                      <Users size={18} />
                      2. Enroll Students
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                      Register students and reference course IDs in the Student Service running on port 5005.
                    </p>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('students')}>
                      Go to Students <ArrowRight size={14} />
                    </button>
                  </div>

                  <div style={{ border: '1px solid var(--border)', padding: 18, borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--primary)' }}>
                      <Layers size={18} />
                      3. Inter-Service Demo
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                      Demonstrate live HTTP request aggregation between Student Service & Course Service.
                    </p>
                    <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('details')}>
                      View Inter-Service Demo <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Students */}
        {activeTab === 'students' && (
          <StudentManager
            students={students}
            courses={courses}
            isLoading={isRefreshing}
            onRefreshStudents={loadAllData}
            onViewStudentCourses={handleViewStudentCourses}
          />
        )}

        {/* Tab 3: Courses */}
        {activeTab === 'courses' && (
          <CourseManager
            courses={courses}
            isLoading={isRefreshing}
            onRefreshCourses={loadAllData}
          />
        )}

        {/* Tab 4: Student-Course Details (Inter-Service) */}
        {activeTab === 'details' && (
          <StudentCourseDetails
            students={students}
            selectedStudentId={selectedStudentId}
            onSelectStudentId={setSelectedStudentId}
          />
        )}
      </main>

      <footer className="footer">
        <p>
          <strong>Student–Course Management System</strong> • MERN Microservices Practical Examination Project (20 Marks)
        </p>
        <p style={{ fontSize: '0.74rem', marginTop: 4, color: '#94a3b8' }}>
          Student Service (:5005) • Course Service (:5006) • Vite React Frontend (:5175) • MongoDB Separate Databases
        </p>
      </footer>
    </div>
  );
}
