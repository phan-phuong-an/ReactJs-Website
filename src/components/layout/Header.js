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
    navigate ('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setAuthenticated(false);
    // notify other parts of the app (same window) that auth state changed
    try {
      window.dispatchEvent(new Event('authChange'));
    } catch (e) {}
    navigate('/login', { replace: true });
  };

  return (
    <header className = "app-header">
      <div className = "header-left">
        <button className = "hamburger" 
        onClick = {() => setCollapsed(!collapsed)} 
        aria-label="Toggle sidebar">☰</button>
      </div>

      <div className = "header-right">
        {authenticated ? (
          <button className = "btn logout" onClick={handleLogout}>Logout</button>
        ) : (
          <button className = "btn login" onClick={handleLogin}>Login</button>
        )}
      </div>
    </header>
  )
} 