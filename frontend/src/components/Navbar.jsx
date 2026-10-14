import React from 'react';
import { GraduationCap, Server, RefreshCw } from 'lucide-react';

export default function Navbar({
  studentHealth,
  courseHealth,
  onRefreshAll,
  isRefreshing
}) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={24} />
          </div>
          <div className="brand-text">
            <h1>Student–Course Management System</h1>
            <p>MERN Microservices Architecture • College Practical Exam Project</p>
          </div>
        </div>

        <div className="health-bar">
          {/* Student Service Status */}
          <div
            className={`health-badge ${studentHealth.online ? 'up' : 'down'}`}
            title={`Student Service: ${studentHealth.online ? 'Online' : 'Offline'}`}
          >
            <span className="pulse-dot"></span>
            <Server size={14} />
            <span>Student Service (:5001) {studentHealth.online ? 'UP' : 'DOWN'}</span>
          </div>

          {/* Course Service Status */}
          <div
            className={`health-badge ${courseHealth.online ? 'up' : 'down'}`}
            title={`Course Service: ${courseHealth.online ? 'Online' : 'Offline'}`}
          >
            <span className="pulse-dot"></span>
            <Server size={14} />
            <span>Course Service (:5002) {courseHealth.online ? 'UP' : 'DOWN'}</span>
          </div>

          {/* Refresh Data */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onRefreshAll}
            disabled={isRefreshing}
            title="Refresh all data and service health"
          >
            <RefreshCw size={14} className={isRefreshing ? 'pulse-dot' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
