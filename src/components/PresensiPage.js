import React, { useState } from "react";
import axios from "axios";
import "./PresensiPage.css";


const API_BASE_URL = "http://localhost:3001/api/presensi"; 

function PresensiPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    };
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      setError("");
      setMessage("");
      
      const response = await axios.post(
        `${API_BASE_URL}/check-in`,
        {},
        getAuthHeaders()
      );
      
      setMessage(response.data.message);
    } catch (err) {
      const errorMessage = err.response 
        ? err.response.data.message 
        : "Gagal melakukan check-in. Periksa koneksi ke server.";
        
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    try {
      setError("");
      setMessage("");
      
      const response = await axios.post(
        `${API_BASE_URL}/check-out`,
        {},
        getAuthHeaders()
      );
      
      setMessage(response.data.message);
    } catch (err) {
      const errorMessage = err.response 
        ? err.response.data.message 
        : "Gagal melakukan check-out. Periksa koneksi ke server.";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate floating shapes untuk background
  const generateFloatingShapes = () => {
    const shapes = [];
    for (let i = 0; i < 15; i++) {
      const size = Math.random() * 100 + 50;
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 20;
      const animationDuration = Math.random() * 10 + 20;
      
      shapes.push(
        <div
          key={i}
          className="presensi-floating-shape"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            animationDelay: `${animationDelay}s`,
            animationDuration: `${animationDuration}s`
          }}
        />
      );
    }
    return shapes;
  };

  return (
    
    <div className="presensi-container">
      {/* Animated Background */}
      <div className="presensi-animated-background">
        <div className="presensi-floating-shapes">
          {generateFloatingShapes()}
        </div>
      </div>
      

      <div className="presensi-content">
        {/* Header Section */}
        <div className="presensi-header">
          <div className="presensi-header-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="presensi-title">Presensi Harian</h1>
          <p className="presensi-subtitle">Catat kehadiran Anda dengan mudah</p>
        </div>

        {/* Main Card */}
        <div className="presensi-card">
          {/* Status Messages */}
          <div className="presensi-status">
            {isLoading && (
              <div className="presensi-loading">
                <div className="presensi-spinner"></div>
                <span>Memproses presensi...</span>
              </div>
            )}

            {message && (
              <div className="presensi-message">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="presensi-error">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="presensi-actions">
            <button
              onClick={handleCheckIn}
              disabled={isLoading}
              className={`presensi-btn presensi-checkin ${isLoading ? 'disabled' : ''}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{isLoading ? 'Memproses...' : 'Check-In'}</span>
            </button>

            <button
              onClick={handleCheckOut}
              disabled={isLoading}
              className={`presensi-btn presensi-checkout ${isLoading ? 'disabled' : ''}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{isLoading ? 'Memproses...' : 'Check-Out'}</span>
            </button>
          </div>

          {/* Info Section */}
          <div className="presensi-info">
            <div className="presensi-info-header">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tips Presensi</span>
            </div>
            <div className="presensi-info-content">
              <p>Lakukan check-in saat mulai bekerja</p>
              <p>Check-out saat selesai bekerja</p>
              <p>Pastikan koneksi internet stabil</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;