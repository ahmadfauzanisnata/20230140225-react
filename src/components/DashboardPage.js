import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, UserCircle, BookOpen, Settings, Bell, Search, Menu, CalendarCheck } from "lucide-react";
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Fungsi untuk navigasi Presensi
  const handlePresensiClick = () => {
    navigate("/presensi");
    setSidebarOpen(false);
  };

  // Fungsi untuk navigasi Kelola Data
  const handleKelolaDataClick = () => {
    if (user.role === "admin") {
      navigate("/reports");
    } else {
      console.log("Navigasi ke halaman Kelas Saya"); 
    }
    setSidebarOpen(false);
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-shapes">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="floating-shape"
              style={{
                width: `${Math.random() * 80 + 20}px`,
                height: `${Math.random() * 80 + 20}px`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 25 + 15}s`,
                animationDelay: `${Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <motion.div 
        className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -300 }}
      >
        <div className="sidebar-header">
          <div className="user-avatar">
            <UserCircle size={48} />
          </div>
          <div className="user-info">
            <h3 className="user-name">{user.nama || "Pengguna"}</h3>
            <p className="user-role">{user.role}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">
            <UserCircle size={20} />
            <span>Dashboard</span>
          </Link>
          
          <button 
            onClick={handlePresensiClick} 
            className="nav-item cursor-pointer w-full text-left"
          >
            <CalendarCheck size={20} />
            <span>Presensi</span>
          </button>
          
          <button 
            onClick={handleKelolaDataClick} 
            className="nav-item cursor-pointer w-full text-left"
          >
            <BookOpen size={20} />
            <span>{user.role === "admin" ? "Kelola Data" : "Kelas Saya"}</span>
          </button>
          
          <Link to="#settings" className="nav-item">
            <Settings size={20} />
            <span>Pengaturan</span>
          </Link>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="menu-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <h1 className="dashboard-title">
              Selamat Datang, <span className="gradient-text">{user.nama || "Pengguna"}</span> 👋
            </h1>
          </div>
          
          <div className="header-right">
            <div className="search-bar">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Cari sesuatu..." 
                className="search-input"
              />
            </div>
            
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="logout-btn"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Cards */}
        <div className="dashboard-grid">
          {/* Presensi Card - Menggantikan Profil Akun */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="dashboard-card presensi-card"
          >
            <div className="card-icon">
              <CalendarCheck size={32} />
            </div>
            <h3 className="card-title">Presensi</h3>
            <p className="card-description">
              Lakukan presensi masuk dan keluar dengan mudah dan cepat.
            </p>
            <motion.button 
              onClick={handlePresensiClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="card-btn primary"
            >
              Presensi Sekarang
            </motion.button>
          </motion.div>

          {/* Kelas / Kelola Data Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="dashboard-card data-card"
          >
            <div className="card-icon">
              <BookOpen size={32} />
            </div>
            <h3 className="card-title">
              {user.role === "admin" ? "Kelola Data" : "Kelas Saya"}
            </h3>
            <p className="card-description">
              {user.role === "admin"
                ? "Akses manajemen data, laporan, dan pengguna."
                : "Lihat daftar kelas yang Anda ikuti."}
            </p>
            <motion.button 
              onClick={handleKelolaDataClick} 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="card-btn secondary"
            >
              {user.role === "admin" ? "Kelola" : "Masuk Kelas"}
            </motion.button>
          </motion.div>

          {/* Pengaturan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="dashboard-card settings-card"
          >
            <div className="card-icon">
              <Settings size={32} />
            </div>
            <h3 className="card-title">Pengaturan</h3>
            <p className="card-description">
              Sesuaikan preferensi dan keamanan akun Anda.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="card-btn tertiary"
            >
              Pengaturan
            </motion.button>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="dashboard-card stats-card"
          >
            <h3 className="card-title">Ringkasan Presensi</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">95%</div>
                <div className="stat-label">Kehadiran</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">12</div>
                <div className="stat-label">Hari Hadir</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">1</div>
                <div className="stat-label">Izin</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity - Diubah menjadi aktivitas presensi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="activity-section"
        >
          <h2 className="section-title">Riwayat Presensi Terbaru</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot presensi-masuk"></div>
              <div className="activity-content">
                <p>Presensi Masuk - Mata Kuliah Algoritma</p>
                <span>Hari ini, 07:30 WIB</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot presensi-keluar"></div>
              <div className="activity-content">
                <p>Presensi Keluar - Mata Kuliah Struktur Data</p>
                <span>Kemarin, 16:45 WIB</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot presensi-masuk"></div>
              <div className="activity-content">
                <p>Presensi Masuk - Mata Kuliah Basis Data</p>
                <span>Kemarin, 08:15 WIB</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>© {new Date().getFullYear()} Sistem Informasi Praktikum — {user.role}</p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage;