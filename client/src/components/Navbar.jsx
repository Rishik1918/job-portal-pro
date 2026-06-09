import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">JobPortalPro</Link>
      <div className="nav-links">
        <NavLink to="/" className="nav-item">Browse Jobs</NavLink>
        {user && (
          <>
            {user.role === 'Recruiter' ? (
              <>
                <NavLink to="/recruiter-dashboard" className="nav-item">Recruiter Console</NavLink>
                <NavLink to="/create-job" className="nav-item">Post Job</NavLink>
              </>
            ) : (
              <NavLink to="/candidate-dashboard" className="nav-item">My Dashboard</NavLink>
            )}
            <button onClick={handleLogoutClick} className="btn btn-secondary">Sign Out</button>
          </>
        )}
        {!user && (
          <>
            <Link to="/login" className="nav-item">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Join Now</Link>
          </>
        )}
        <button 
          onClick={toggleTheme} 
          className="btn btn-secondary" 
          style={{ padding: '0.6rem 0.9rem', fontSize: '1rem', border: '1px solid var(--border-color)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
