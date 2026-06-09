import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Forgot Password Modal State variables
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        login(data.data);
        navigate(data.data.role === 'Recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Connection failure. Please check your network and API backend.');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMessage('');
    setForgotError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (data.success) {
        setForgotMessage(data.message);
      } else {
        setForgotError(data.message);
      }
    } catch (err) {
      setForgotError('Connection error. Failed to execute reset command.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label>Password</label>
            <input type="password" className="form-control" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-group" style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
            <button type="button" onClick={() => setShowForgot(true)} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>
              Forgot Password?
            </button>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Authenticate</button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          New to the portal? <Link to="/register" style={{ color: 'var(--accent-blue)' }}>Create Account</Link>
        </div>
      </div>

      {/* Forgot Password Modal Popup Overlay */}
      {showForgot && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="auth-title" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>Reset Password</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Enter your email address. For this local evaluation database environment, we will instantly reset your password to <strong>password123</strong> so you can log back in.
            </p>
            {forgotError && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{forgotError}</div>}
            {forgotMessage && <div style={{ color: 'var(--success)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>{forgotMessage}</div>}
            <form onSubmit={handleForgotSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="e.g. auto_recruiter@test.com" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Reset Password</button>
                <button type="button" onClick={() => { setShowForgot(false); setForgotEmail(''); setForgotMessage(''); setForgotError(''); }} className="btn btn-secondary" style={{ flex: 1 }}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
