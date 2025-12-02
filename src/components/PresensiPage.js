import React, { useState, useEffect } from "react";
import axios from "axios";
// Import komponen Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css"; 

import "./PresensiPage.css";

// Fix untuk ikon marker Leaflet
// Catatan: Ini diperlukan untuk mengatasi masalah jalur aset di environment React tertentu.
// Pastikan Anda telah menginstal 'leaflet' dan 'react-leaflet'.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
// END OF LEAFLET FIX

const API_BASE_URL = "http://localhost:3001/api/presensi"; 

function PresensiPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // HOOK BARU UNTUK LOKASI
  const [coords, setCoords] = useState(null); // {lat, lng}
  const [isLocationLoading, setIsLocationLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    };
  };

  // FUNGSI UNTUK MENDAPATKAN LOKASI PENGGUNA
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
          setError(""); // Hapus error jika berhasil mendapatkan lokasi
        },
        (locError) => {
          // Gagal mendapatkan lokasi
          const errorMsg = `Gagal mendapatkan lokasi: ${locError.message}. Mohon izinkan akses lokasi.`;
          setError(errorMsg);
          setIsLocationLoading(false);
          setCoords(null); // Set koordinat ke null
        },
        // Opsi Geolocation API
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      const errorMsg = "Geolocation tidak didukung oleh browser ini.";
      setError(errorMsg);
      setIsLocationLoading(false);
    }
  };


  const handleCheckIn = async () => {
    // 1. Validasi Lokasi Sebelum Memulai
    if (isLocationLoading) {
      setError("Lokasi sedang dimuat, mohon tunggu sebentar.");
      return;
    }
    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }

    setIsLoading(true);
    try {
      setError("");
      setMessage("");
      
      const response = await axios.post(
        `${API_BASE_URL}/check-in`,
        {
          // 2. Kirim koordinat di body request
          latitude: coords.lat,
          longitude: coords.lng
        },
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
    // 1. Validasi Lokasi Sebelum Memulai
    if (isLocationLoading) {
      setError("Lokasi sedang dimuat, mohon tunggu sebentar.");
      return;
    }
    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }

    setIsLoading(true);
    try {
      setError("");
      setMessage("");
      
      const response = await axios.post(
        `${API_BASE_URL}/check-out`,
        {
          // 2. Kirim koordinat di body request
          latitude: coords.lat,
          longitude: coords.lng
        },
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
  
  // Dapatkan lokasi saat komponen dimuat
  useEffect(() => {
    getLocation();
    // Cleanup function jika diperlukan
  }, []); 
  
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

        {/* TAMPILAN STATUS LOKASI */}
        <div className={`presensi-location-status ${coords ? 'status-ok' : (isLocationLoading ? 'status-loading' : 'status-fail')}`}>
            <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>{isLocationLoading ? 'Mencari Lokasi...' : (coords ? `Lokasi Aktif: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : 'Lokasi Gagal (Cek Izin Browser)')}</span>
        </div>

        {/* VISUALISASI PETA DITAMBAHKAN DI SINI */}
        {coords && (
            <div className="my-4 presensi-map-wrapper"> 
                <MapContainer 
                    key={`${coords.lat}-${coords.lng}`}
                    center={[coords.lat, coords.lng]} 
                    zoom={15} 
                    style={{ height: '300px', width: '100%' }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[coords.lat, coords.lng]}>
                        <Popup>Lokasi Presensi Anda</Popup>
                    </Marker>
                </MapContainer>
            </div>
        )}
        {/* AKHIR PETA */}

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

            {error && !isLocationLoading && (
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
              // Disabled jika sedang loading atau lokasi belum siap
              disabled={isLoading || isLocationLoading || !coords}
              className={`presensi-btn presensi-checkin ${isLoading || isLocationLoading || !coords ? 'disabled' : ''}`}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{isLoading ? 'Memproses...' : 'Check-In'}</span>
            </button>

            <button
              onClick={handleCheckOut}
              // Disabled jika sedang loading atau lokasi belum siap
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
              <span>Tips Presensi</span>
            </div>
            <div className="presensi-info-content">
              <p>Pastikan izin lokasi diaktifkan di browser Anda.</p>
              <p>Lakukan check-in dan check-out dari lokasi yang valid.</p>
              <p>Pastikan koneksi internet stabil.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;