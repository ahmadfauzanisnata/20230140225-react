import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ReportPage.css";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchReports = useCallback(async (query = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      const url = `http://localhost:3001/api/reports/daily${query}`;
      const response = await axios.get(url, getAuthHeaders());
      setReports(response.data.data || []);
      setError(null);
    } catch (err) {
      setReports([]);
      setError(
        err.response ? err.response.data.message : "Gagal mengambil data"
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

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

  const formatDuration = (checkIn, checkOut) => {
    if (!checkOut) return (
      <span className="report-badge report-badge-pending">
        Belum selesai
      </span>
    );
    const diffMs = new Date(checkOut) - new Date(checkIn);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return (
      <span className="report-badge report-badge-active">
        {hours}j {minutes}m
      </span>
    );
  };

  // Generate floating shapes untuk background
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

  return (
    <div className="report-container">
      {/* Tombol Kembali ke Dashboard */}
      <div className="report-back-button">
        <a href="/dashboard">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Dashboard
        </a>
      </div>
      
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
          <h1 className="report-title">Laporan Presensi</h1>
          <p className="report-subtitle">Pantau kehadiran tim Anda dengan mudah</p>
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
            <div className="report-stat-label">Total Records</div>
          </div>
        </div>

        {/* Filter Card */}
        <div className="report-filter-card">
          <h2 className="report-filter-title">Filter Laporan</h2>
          <form onSubmit={handleSearchSubmit}>
            <div className="report-filter-form">
              <div className="report-filter-group">
                <label className="report-filter-label">Cari Nama</label>
                <input
                  type="text"
                  placeholder="Masukkan nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="report-filter-input"
                />
              </div>
              
              <div className="report-filter-group">
                <label className="report-filter-label">Tanggal Mulai</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="report-filter-input"
                />
              </div>
              
              <div className="report-filter-group">
                <label className="report-filter-label">Tanggal Selesai</label>
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
                  <button type="submit" className="report-filter-btn report-filter-apply">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Terapkan Filter
                  </button>
                  <button type="button" onClick={handleReset} className="report-filter-btn report-filter-reset">
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
            
            <div className="overflow-x-auto">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Karyawan</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Durasi</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length > 0 ? (
                    reports.map((presensi) => {
                      const checkInTime = new Date(presensi.checkIn);
                      const checkOutTime = presensi.checkOut ? new Date(presensi.checkOut) : null;
                      
                      return (
                        <tr key={presensi.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div className="report-user-avatar">
                                {presensi.user ? presensi.user.nama.charAt(0).toUpperCase() : "U"}
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
                          <td>
                            <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', marginBottom: '0.25rem' }}>
                              {checkInTime.toLocaleDateString("id-ID", {
                                day: '2-digit', month: 'short', year: 'numeric'
                              })}
                            </div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                              {checkInTime.toLocaleTimeString("id-ID", {
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </div>
                          </td>
                          <td>
                            {presensi.checkOut ? (
                              <>
                                <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', marginBottom: '0.25rem' }}>
                                  {checkOutTime.toLocaleDateString("id-ID", {
                                    day: '2-digit', month: 'short', year: 'numeric'
                                  })}
                                </div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
                                  {checkOutTime.toLocaleTimeString("id-ID", {
                                    hour: '2-digit', minute: '2-digit'
                                  })}
                                </div>
                              </>
                            ) : (
                              <span className="report-badge report-badge-inactive">
                                Belum Check-Out
                              </span>
                            )}
                          </td>
                          <td>
                            {formatDuration(presensi.checkIn, presensi.checkOut)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4">
                        <div className="report-empty">
                          <svg className="report-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div className="report-empty-title">Tidak ada data yang ditemukan</div>
                          <div className="report-empty-description">Coba ubah filter pencarian Anda</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportPage;