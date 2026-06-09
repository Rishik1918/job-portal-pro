import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CandidateDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCandidateTelemetry = async () => {
    try {
      const appRes = await fetch('http://localhost:5000/api/jobs/candidate/applications', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const appData = await appRes.json();
      if (appData.success) setAppliedJobs(appData.data);

      const profRes = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const profData = await profRes.json();
      if (profData.success) setProfile(profData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidateTelemetry();
  }, []);

  const handleRemoveBookmark = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/save`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProfile(prev => ({
          ...prev,
          savedJobs: prev.savedJobs.filter(job => job._id !== jobId)
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="spinner-box"><div className="spinner"></div></div>;

  return (
    <div className="dashboard-layout">
      <div className="detail-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Professional Profile</h3>
          {profile && (
            <div className="auth-card" style={{ marginTop: '1rem', width: '100%', padding: '1.75rem' }}>
              <h2 style={{ color: 'var(--accent-blue)', fontSize: '1.75rem', fontWeight: 800 }}>{profile.name}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{profile.email}</p>
              <div style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
                <strong style={{ color: 'var(--text-main)' }}>Location:</strong> {profile.location || 'Not Specified'}
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
                <strong style={{ color: 'var(--text-main)' }}>Experience:</strong> {profile.experience} Years
              </div>
              <div style={{ marginTop: '1.25rem' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Skills Portfolio:</strong>
                <div className="job-tags" style={{ marginTop: '0.5rem' }}>
                  {profile.skills.length === 0 ? (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No skills added</span>
                  ) : (
                    profile.skills.map((s, idx) => <span key={idx} className="tag">{s}</span>)
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Applications Tracker</h3>
          <div className="grid-3" style={{ gridTemplateColumns: '1fr', marginTop: '1rem' }}>
            {appliedJobs.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No application submissions recorded yet.</p>
            ) : (
              appliedJobs.map(app => app.jobId && (
                <div key={app._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Job Title:</span>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.1rem' }}>{app.jobId.title}</h4>
                    </div>
                    <span className="tag" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', borderColor: 'var(--success)', fontWeight: 600 }}>Submitted</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Company:</span>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{app.jobId.company} • {app.jobId.location}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Applied Date:</span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-indigo)', marginTop: '0.1rem' }}>
                      {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <h3 style={{ marginTop: '2.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Bookmarked Opportunities</h3>
          <div className="grid-3" style={{ gridTemplateColumns: '1fr', marginTop: '1rem' }}>
            {!profile || profile.savedJobs.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No saved jobs found in bookmarks.</p>
            ) : (
              profile.savedJobs.map(job => (
                <div key={job._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{job.title}</h4>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{job.company}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => navigate(`/jobs/${job._id}`)} className="btn btn-secondary">Inspect</button>
                    <button onClick={() => handleRemoveBookmark(job._id)} className="btn btn-danger">Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
