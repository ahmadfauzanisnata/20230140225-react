import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './RegisterPage.css'; // File CSS terpisah untuk register

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    role: "mahasiswa",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/api/auth/register", formData);
     
      if (res.status === 201 || res.status === 200) {
        alert("Registrasi berhasil! Silakan login.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Gagal register:", error);
      alert(
        error.response?.data?.message || "Terjadi kesalahan saat registrasi."
      );
    }
  };

  return (
    <div className="register-container">
      <div className="floating-elements">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="floating-element"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      <div className="particles">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 5 + 1}px`,
              height: `${Math.random() * 5 + 1}px`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      <div className="register-card-container">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">Daftar Akun</h1>
            <p className="register-subtitle">Bergabunglah dengan komunitas kami</p>
          </div>
          
          <form onSubmit={handleSubmit} className="register-form">
            {/* Nama */}
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Masukkan email Anda"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Buat password yang kuat"
              />
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label">Peran</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select"
              >
                <option value="mahasiswa">Mahasiswa</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="register-button"
            >
              Daftar Sekarang
            </button>
          </form>

          <div className="footer-text">
            <p>
              Sudah punya akun?{" "}
              <span
                onClick={() => navigate("/login")}
                className="footer-link"
              >
                Login di sini
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;