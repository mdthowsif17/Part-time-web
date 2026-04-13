import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate(user ? '/home' : '/')} style={{ cursor: 'pointer' }}>
        Daily<span>Jobs</span>
      </div>

      <div className="nav-links">
        {user ? (
          <>
            <span className={`nav-badge ${user.role === 'employer' ? 'employer' : ''}`}>
              {user.role === 'employer' ? '🏢 Employer' : '👤 User'}
            </span>

            {/* USER NAV */}
            {user.role === 'user' && (
              <>
                <button className={`nav-btn ${isActive('/home')}`} onClick={() => navigate('/home')}>
                  Browse Jobs
                </button>
                <button className={`nav-btn ${isActive('/my-applications')}`} onClick={() => navigate('/my-applications')}>
                  My Applications
                </button>
              </>
            )}

            {/* EMPLOYER NAV */}
            {user.role === 'employer' && (
              <>
                <button className={`nav-btn ${isActive('/home')}`} onClick={() => navigate('/home')}>
                  Dashboard
                </button>
                <button className={`nav-btn ${isActive('/post-job')}`} onClick={() => navigate('/post-job')}>
                  + Post Job
                </button>
              </>
            )}

            <button className="nav-btn logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className={`nav-btn ${isActive('/login')}`} onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}
