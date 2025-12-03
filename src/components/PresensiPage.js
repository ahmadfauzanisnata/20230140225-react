import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import Webcam from 'react-webcam';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import "leaflet/dist/leaflet.css"; 
import "./PresensiPage.css";

const API_BASE_URL = "http://localhost:3001/api/presensi"; 

// Fix untuk ikon marker Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function PresensiPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState(null); 
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [image, setImage] = useState(null); 
  const webcamRef = useRef(null); 

  const getToken = () => localStorage.getItem("token");

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc); 
    }
  }, [webcamRef]);

  const getAuthHeaders = (isFormData = false) => {
    const token = getToken();
    let headers = {
      Authorization: `Bearer ${token}` 
    };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return { headers };
  };

  const getLocation = () => {
    setIsLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocationLoading(false);
          setError("");
        },
        (locError) => {
          const errorMsg = `Gagal mendapatkan lokasi: ${locError.message}. Mohon izinkan akses lokasi.`;
          setError(errorMsg);
          setIsLocationLoading(false);
          setCoords(null);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      const errorMsg = "Geolocation tidak didukung oleh browser ini.";
      setError(errorMsg);
      setIsLocationLoading(false);
    }
  };

  const createFormData = async (type) => {
    if (!coords || !image) {
      throw new Error("Lokasi dan Foto wajib ada!");
    }
    
    const blob = await (await fetch(image)).blob();

    const formData = new FormData();
    formData.append('latitude', coords.lat);
    formData.append('longitude', coords.lng);
    formData.append('buktiFoto', blob, `${type}-selfie-${Date.now()}.jpeg`); 
    
    return formData;
  };

  const createCheckOutBody = () => {
    if (!coords) {
      throw new Error("Lokasi wajib ada!");
    }
    
    return {
      latitude: coords.lat,
      longitude: coords.lng
    };
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");
    
    try {
      const formData = await createFormData('check-in');
      
      const response = await axios.post(
        `${API_BASE_URL}/check-in`,
        formData,
        getAuthHeaders(true) 
      );
      
      setMessage(response.data.message || "Check-in berhasil!");
      setImage(null);
    } catch (err) {
      const errorMessage = err.message || (err.response ? err.response.data.message : "Gagal melakukan check-in. Periksa koneksi ke server.");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");
    
    try {
      const checkOutBody = createCheckOutBody(); 
      
      const response = await axios.post(
        `${API_BASE_URL}/check-out`,
        checkOutBody,
        getAuthHeaders(false)
      );
      
      setMessage(response.data.message || "Check-out berhasil!");
      setImage(null);
    } catch (err) {
      const errorMessage = err.message || (err.response ? err.response.data.message : "Gagal melakukan check-out. Periksa koneksi ke server.");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  useEffect(() => {
    getLocation();
  }, []); 
  
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
      {/* Tombol Kembali ke Dashboard */}
      <button
        onClick={handleBackToDashboard}
        className="presensi-dashboard-back-btn"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Kembali ke Dashboard</span>
      </button>

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
          <p className="presensi-subtitle">Catat kehadiran Anda dengan mudah dan akurat</p>
        </div>

        {/* Status Lokasi */}
        <div className="presensi-location-status-wrapper">
          <div className={`presensi-location-status ${coords ? 'status-ok' : (isLocationLoading ? 'status-loading' : 'status-fail')}`}>
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>
              {isLocationLoading ? 'Mencari lokasi Anda...' : 
               coords ? `Lokasi ditemukan: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` : 
               'Lokasi tidak dapat diakses'}
            </span>
          </div>
        </div>

        {/* Visualisasi Peta */}
        {coords && (
          <div className="presensi-map-wrapper"> 
            <MapContainer 
              key={`${coords.lat}-${coords.lng}`}
              center={[coords.lat, coords.lng]} 
              zoom={16} 
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
              dragging={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Anda berada di sini</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Main Card */}
        <div className="presensi-card">
          {/* Camera Section */}
          <div className="presensi-camera-section">
            <div className="presensi-camera-container">
              {image ? (
                <img src={image} alt="Selfie Bukti Presensi" className="presensi-photo" />
              ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="presensi-webcam"
                  videoConstraints={{
                    facingMode: "user",
                    width: 640,
                    height: 480
                  }}
                />
              )}
            </div>

            {/* Tombol Kamera */}
            <div className="presensi-camera-actions">
              {!image ? (
                <button
                  onClick={capture}
                  disabled={isLoading || isLocationLoading}
                  className="presensi-capture-btn"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ambil Foto
                </button>
              ) : (
                <button 
                  onClick={() => setImage(null)} 
                  disabled={isLoading}
                  className="presensi-retake-btn"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Foto Ulang
                </button>
              )}
            </div>
          </div>

          {/* Status Messages */}
          <div className="presensi-status">
            {isLoading && (
              <div className="presensi-loading">
                <div className="presensi-spinner"></div>
                <span>Memproses presensi Anda...</span>
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

            {error && !isLocationLoading && (
              <div className="presensi-error">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Action Buttons - PERBAIKAN: Check-Out tidak membutuhkan foto */}
          <div className="presensi-actions">
            <button
              onClick={handleCheckIn}
              disabled={isLoading || isLocationLoading || !coords || !image}
              className={`presensi-btn presensi-checkin ${isLoading || isLocationLoading || !coords || !image ? 'disabled' : ''}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{isLoading ? 'Memproses...' : 'Check-In'}</span>
            </button>

            <button
              onClick={handleCheckOut}
              disabled={isLoading || isLocationLoading || !coords}
              className={`presensi-btn presensi-checkout ${isLoading || isLocationLoading || !coords ? 'disabled' : ''}`}
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
              <span>Panduan Presensi</span>
            </div>
            <div className="presensi-info-content">
              <p>Ambil foto selfie yang jelas sebagai bukti kehadiran</p>
              <p>Pastikan izin lokasi diaktifkan di browser Anda</p>
              <p>Lakukan Check-In saat datang dan Check-Out saat pulang</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;