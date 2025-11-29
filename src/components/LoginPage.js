import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Kita akan buat file CSS terpisah

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: password
      });

      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem('token', token); 
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');

    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login gagal');
    }
  };

  return (
    <div className="login-container">
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
      
      <div className="login-card-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Selamat Datang</h1>
            <p className="login-subtitle">Masuk untuk melanjutkan ke dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="Masukkan email Anda"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Masukkan password Anda"
              />
            </div>
            
            <button type="submit" className="login-button">
              Login
            </button>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </form>
          
          <div className="footer-text">
            <p>Belum Punya Akun? <a href="/register">Daftar di sini</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;