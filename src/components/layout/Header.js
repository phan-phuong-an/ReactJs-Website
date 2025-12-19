import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setAuthenticated(false);
    try {
      window.dispatchEvent(new Event('authChange'));
    } catch (e) { }
    navigate('/login', { replace: true });
  };

  return (
    <header className="d-flex align-items-center justify-content-between p-3 bg-white border-bottom">
      <div className="d-flex align-items-center gap-3">
        <button 
          className="btn btn-link p-0 fs-5 text-decoration-none"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
          style={{background: 'transparent', border: 'none', cursor: 'pointer' }}>
          ☰
        </button>
      </div>

      <div className="d-flex align-items-center gap-2">
        {authenticated ? (
          <button className="btn btn-danger btn-sm rounded-pill" 
          style={{ width: "80px" , height: "30px" }}
          onClick={handleLogout}>Logout</button>
        ) : (
          <button className="btn btn-primary btn-sm rounded-pill" onClick={handleLogin}>Login</button>
        )}
      </div>
    </header>
  )
} 