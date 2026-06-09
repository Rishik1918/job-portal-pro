import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Candidate',
    skills: '', experience: '', location: ''
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        login(data.data);
        navigate(data.data.role === 'Recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server registration error processing metadata parameters');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Pro Account</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" className="form-control" required value={formData.name} onChange={handleFormChange} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" className="form-control" required value={formData.email} onChange={handleFormChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" className="form-control" required value={formData.password} onChange={handleFormChange} />
          </div>
          <div className="form-group">
            <label>Account Track Role</label>
            <select name="role" className="form-control" value={formData.role} onChange={handleFormChange}>
              <option value="Candidate">Candidate (Job Seeker)</option>
              <option value="Recruiter">Recruiter (Hiring Executive)</option>
            </select>
          </div>
          {formData.role === 'Candidate' && (
            <>
              <div className="form-group">
                <label>Skills (Comma Separated)</label>
                <input type="text" name="skills" placeholder="React, Node, Express" className="form-control" value={formData.skills} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label>Experience (Years)</label>
                <input type="number" name="experience" className="form-control" value={formData.experience} onChange={handleFormChange} />
              </div>
              <div className="form-group">
                <label>Location Preference</label>
                <input type="text" name="location" className="form-control" value={formData.location} onChange={handleFormChange} />
              </div>
            </>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Register</button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Account active? <Link to="/login" style={{ color: 'var(--accent-blue)' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
