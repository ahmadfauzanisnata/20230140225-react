import React from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

function Navbar() {
  const token = localStorage.getItem('token');
  let user = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch (err) {
      console.warn('Token decode failed', err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      {/* Animated Background */}
      <div className="navbar-background">
        <div className="navbar-floating-shapes">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="navbar-floating-shape"
              style={{
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${Math.random() * 10 + 20}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-brand">
          <Link to={token ? "/dashboard" : "/"} className="navbar-logo">
            <div className="navbar-logo-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="navbar-logo-text">PresensiApp</span>
          </Link>
        </div>

        {/* Navigation Menu - Only show when logged in */}
        {token && (
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-menu-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </Link>
            <Link to="/presensi" className="navbar-menu-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Presensi</span>
            </Link>
            {user && user.role === 'admin' && (
              <Link to="/reports" className="navbar-menu-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Laporan</span>
              </Link>
            )}
          </div>
        )}

        {/* User Section */}
        <div className="navbar-user">
          {token && user ? (
            <div className="navbar-user-info">
              <div className="navbar-user-avatar">
                {user.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="navbar-user-details">
                <span className="navbar-user-name">{user.nama || 'User'}</span>
                <span className="navbar-user-role">{user.role || 'user'}</span>
              </div>
              <button onClick={handleLogout} className="navbar-logout-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-login-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;