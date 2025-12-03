import React, { useState, useEffect, useCallback } from "react";
import "./ReportPage.css";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const mockTokenKey = 'mock_auth_token_set';
    if (!localStorage.getItem("token")) {
      localStorage.setItem("token", "MOCK_TOKEN_FOR_DEMO");
      localStorage.setItem(mockTokenKey, 'true');
    }
    
    return () => {
      if (localStorage.getItem(mockTokenKey) === 'true') {
        localStorage.removeItem("token");
        localStorage.removeItem(mockTokenKey);
      }
    };
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  const fetchReports = useCallback(async (query = "") => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      console.error("Authentication token not found. Cannot fetch reports.");
      return;
    }

    try {
      setIsLoading(true);
      const url = `http://localhost:3001/api/reports/daily${query}`;
      
      const response = await fetch(url, { 
        method: 'GET',
        headers: getAuthHeaders().headers 
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      setReports(data.data || []);
      setError(null);
    } catch (err) {
      setReports([]);
      setError(err.message || "Gagal terhubung ke server. Periksa koneksi internet Anda.");
      console.error("Error fetching reports:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.append('nama', searchTerm);
    }
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }
    
    const queryString = params.toString();
    fetchReports(queryString ? `?${queryString}` : "");
  };

  const handleReset = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    fetchReports();
  };

  const generateFloatingShapes = () => {
    const shapes = [];
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 120 + 30;
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 25;
      const animationDuration = Math.random() * 15 + 25;
      
      shapes.push(
        <div
          key={i}
          className="report-floating-shape"
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

  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl);
  };

  const handleClosePhotoModal = () => {
    setSelectedPhoto(null);
  };

  const formatDateTime = (dateString, type = 'date') => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      if (type === 'date') {
        return date.toLocaleDateString("id-ID", {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      } else if (type === 'time') {
        return date.toLocaleTimeString("id-ID", {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }
      return 'N/A';
    } catch (error) {
      return 'N/A';
    }
  };

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="report-container">
      {/* Tombol Kembali ke Dashboard */}
      <button
        onClick={handleBackToDashboard}
        className="report-dashboard-back-btn"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Kembali ke Dashboard</span>
      </button>

      {/* Animated Background */}
      <div className="report-animated-background">
        <div className="report-floating-shapes">
          {generateFloatingShapes()}
        </div>
      </div>

      <div className="report-content">
        {/* Header Section */}
        <div className="report-header">
          <div className="report-header-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="report-title">Laporan Presensi Harian</h1>
          <p className="report-subtitle">Pantau dan kelola data kehadiran karyawan dengan tampilan yang informatif</p>
        </div>

        {/* Stats Cards */}
        <div className="report-stats">
          <div className="report-stat-card">
            <div className="report-stat-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="report-stat-value">{reports.length}</div>
            <div className="report-stat-label">Total Presensi</div>
          </div>
          
          <div className="report-stat-card">
            <div className="report-stat-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="report-stat-value">
              {reports.filter(r => r.latitude).length}
            </div>
            <div className="report-stat-label">Dengan Lokasi</div>
          </div>
          
          <div className="report-stat-card">
            <div className="report-stat-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="report-stat-value">
              {reports.filter(r => r.buktiFoto).length}
            </div>
            <div className="report-stat-label">Dengan Foto</div>
          </div>
          
          <div className="report-stat-card">
            <div className="report-stat-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="report-stat-value">
              {reports.filter(r => r.checkOut).length}
            </div>
            <div className="report-stat-label">Selesai Check-Out</div>
          </div>
        </div>

        {/* Filter Card */}
        <div className="report-filter-card">
          <h2 className="report-filter-title">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Laporan
          </h2>
          <form onSubmit={handleSearchSubmit}>
            <div className="report-filter-form">
              <div className="report-filter-group">
                <label className="report-filter-label">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Cari Nama
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama karyawan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="report-filter-input"
                />
              </div>
              
              <div className="report-filter-group">
                <label className="report-filter-label">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="report-filter-input"
                />
              </div>
              
              <div className="report-filter-group">
                <label className="report-filter-label">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="report-filter-input"
                />
              </div>

              <div className="report-filter-group">
                <label className="report-filter-label">&nbsp;</label>
                <div className="report-filter-actions">
                  <button type="submit" className="report-filter-btn report-filter-apply" disabled={isLoading}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {isLoading ? 'Memproses...' : 'Terapkan Filter'}
                  </button>
                  <button type="button" onClick={handleReset} className="report-filter-btn report-filter-reset" disabled={isLoading}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="report-status">
            <div className="report-loading">
              <div className="report-spinner"></div>
              <span>Memuat data laporan...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="report-status">
            <div className="report-error">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Reports Table */}
        {!error && !isLoading && (
          <div className="report-table-card">
            <div className="report-table-header">
              <h3 className="report-table-title">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Data Presensi ({reports.length} records)
              </h3>
            </div>
            
            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Karyawan</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Latitude (In)</th>
                    <th>Longitude (In)</th>
                    <th>Foto (In)</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length > 0 ? (
                    reports.map((presensi) => {
                      const latitude = presensi.latitude;
                      const longitude = presensi.longitude;
                      const photoUrl = presensi.buktiFoto;
                      
                      return (
                        <tr key={presensi.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div className="report-user-avatar">
                                {presensi.user ? presensi.user.nama.charAt(0).toUpperCase() : (presensi.nama ? presensi.nama.charAt(0).toUpperCase() : "U")}
                              </div>
                              <div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>
                                  {presensi.user ? presensi.user.nama : presensi.nama || "N/A"}
                                </div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                                  {presensi.user ? presensi.user.email : "-"}
                                </div>
                              </div>
                            </div>
                          </td>
                          {/* Check-In */}
                          <td>
                            <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', marginBottom: '0.25rem' }}>
                              {formatDateTime(presensi.checkIn, 'date')}
                            </div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                              {formatDateTime(presensi.checkIn, 'time')}
                            </div>
                          </td>
                          {/* Check-Out */}
                          <td>
                            {presensi.checkOut ? (
                              <>
                                <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', marginBottom: '0.25rem' }}>
                                  {formatDateTime(presensi.checkOut, 'date')}
                                </div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                                  {formatDateTime(presensi.checkOut, 'time')}
                                </div>
                              </>
                            ) : (
                              <span className="report-badge report-badge-pending">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="12" height="12">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Belum Check-Out
                              </span>
                            )}
                          </td>
                          
                          {/* Latitude (In) */}
                          <td>
                            <div className="location-coordinate">
                              {latitude ? parseFloat(latitude).toFixed(6) : 'N/A'}
                            </div>
                          </td>
                          
                          {/* Longitude (In) */}
                          <td>
                            <div className="location-coordinate">
                              {longitude ? parseFloat(longitude).toFixed(6) : 'N/A'}
                            </div>
                          </td>

                          {/* Foto (In) */}
                          <td>
                            {photoUrl ? (
                              <img 
                                src={photoUrl} 
                                alt="Bukti Check-in" 
                                className="photo-thumbnail"
                                onClick={() => handlePhotoClick(photoUrl)}
                                onError={(e) => { 
                                  e.target.onerror = null; 
                                  e.target.src = "https://placehold.co/50x50/667eea/ffffff?text=FOTO"; 
                                }}
                              />
                            ) : (
                              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                                Tidak tersedia
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6">
                        <div className="report-empty">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="report-empty-icon">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div className="report-empty-title">Tidak ada data yang ditemukan</div>
                          <div className="report-empty-description">
                            Coba ubah filter pencarian Anda atau pastikan server API berjalan dengan benar.
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal untuk menampilkan foto full size */}
        {selectedPhoto && (
          <div className="photo-modal-overlay" onClick={handleClosePhotoModal}>
            <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
              <img 
                src={selectedPhoto} 
                alt="Foto Bukti Presensi - Ukuran Penuh" 
                className="photo-full-size"
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = "https://placehold.co/600x400/667eea/ffffff?text=FOTO+TIDAK+TERSEDIA"; 
                }}
              />
              <button className="photo-modal-close" onClick={handleClosePhotoModal} aria-label="Tutup">
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportPage;