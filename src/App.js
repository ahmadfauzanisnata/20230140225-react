import React from 'react';
// Menggunakan useLocation untuk logika penyembunyian Navbar
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import SEMUA komponen yang Anda miliki
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import ReportPage from './pages/ReportPage';
import PresensiPage from './components/PresensiPage';
import Navbar from './components/Navbar'; 


// ----------------------------------------------------
// Komponen Pembungkus untuk Menangani Logika (useLocation harus di dalam Router)
// ----------------------------------------------------
function AppContent() {
    // Hook untuk mengetahui di path mana kita berada saat ini
    const location = useLocation();

    // Tentukan path mana yang TIDAK membutuhkan Navbar (Login, Register, Home root)
    const noNavbarPaths = ['/login', '/register', '/presensi', '/reports', '/']; 
    
    // Cek apakah Navbar harus disembunyikan di path saat ini
    const shouldHideNavbar = noNavbarPaths.includes(location.pathname);

    return (
      <div className="app-container">
          
          {/*
            1. RENDERING NAVBAR SECARA KONDISIONAL
            Navbar HANYA akan muncul jika user TIDAK di halaman login, register, atau root.
          */}
          {!shouldHideNavbar && <Navbar />} 

          {/* 2. DEFINISI ROUTE */}
          <Routes>
              {/* Route Halaman yang membutuhkan Login (Dashboard dan Fitur) */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/reports" element={<ReportPage/>} />
              <Route path="/presensi" element={<PresensiPage/>} />
                
              
              {/* Route Halaman Public/Awal */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<LoginPage />} /> 
          </Routes>
      </div>
    );
}

// ----------------------------------------------------
// Komponen Utama App (Pembungkus Router)
// ----------------------------------------------------
function App() {
    // Hanya membungkus dengan Router sekali
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;