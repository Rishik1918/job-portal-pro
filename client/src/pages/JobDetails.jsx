import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appForm, setAppForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${id}`);
        const data = await res.json();
        if (data.success) setJob(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    
    // Valid phone number rule check: 10-digit number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(appForm.phone)) {
      setMessage('Error: Please enter a valid 10-digit phone number starting with 6-9.');
      return;
    }

    if (!resumeFile) {
      setMessage('Error: Please upload a PDF resume file.');
      return;
    }
    
    try {
      const dataPayload = new FormData();
      dataPayload.append('name', appForm.name);
      dataPayload.append('email', appForm.email);
      dataPayload.append('phone', appForm.phone);
      dataPayload.append('resume', resumeFile);

      const res = await fetch(`http://localhost:5000/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}` // Omitting Content-Type
        },
        body: dataPayload
      });
      const data = await res.json();
      if (data.success) {
        setApplied(true);
        setMessage('Application submitted successfully!');
      } else {
        setMessage(data.message || 'Failed to submit application.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Network error submitting application.');
    }
  };

  const handleSaveToggle = async () => {
    if (!user) return navigate('/login');
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}/save`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) setMessage(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="spinner-box"><div className="spinner"></div></div>;
  if (!job) return <div style={{ textAlign: 'center', padding: '3rem' }}>Job details not found.</div>;

  return (
    <div className="dashboard-layout">
      <div className="detail-grid">
        <div>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '2rem' }}>
            {job.logoUrl ? (
              <img 
                src={`http://localhost:5000${job.logoUrl}`} 
                alt={`${job.company} Logo`} 
                style={{ width: '64px', height: '64px', borderRadius: '0.75rem', objectFit: 'cover', border: '1px solid var(--border-color)' }} 
              />
            ) : (
              <div style={{ width: '64px', height: '64px', borderRadius: '0.75rem', background: 'linear-gradient(135deg, var(--accent-indigo) 0%, var(--accent-blue) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.75rem', color: '#fff' }}>
                {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
              </div>
            )}
            <div>
              <div style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{job.type}</div>
              <h1 style={{ fontSize: '2.5rem', margin: '0.25rem 0 0.5rem 0', lineHeight: '1.2', letterSpacing: '-0.5px' }}>{job.title}</h1>
              <h3 style={{ color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>{job.company} • {job.location}</h3>
            </div>
          </div>
          <hr style={{ borderColor: 'var(--border-color)', marginBottom: '2rem' }} />
          <h3 style={{ marginBottom: '1rem' }}>Description</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{job.description}</p>
        </div>
        <div>
          <div className="auth-card" style={{ position: 'sticky', top: '100px' }}>
            <h3 style={{ marginBottom: '1.25rem' }}>Job Overview</h3>
            <div style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
              Salary bracket: <strong style={{ color: 'var(--text-main)' }}>₹{job.salary ? job.salary.toLocaleString('en-IN') : '0'} / yr</strong>
            </div>
            {message && <div style={{ color: 'var(--success)', marginBottom: '1rem', fontSize: '0.95rem', fontWeight: 600 }}>{message}</div>}
            
            {user?.role !== 'Recruiter' && (
              <>
                <button onClick={handleSaveToggle} className="btn btn-secondary" style={{ width: '100%', marginBottom: '1rem' }}>
                  Bookmark Listing
                </button>
                {!applied ? (
                  <form onSubmit={handleApplySubmit} style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Apply Instantly</h4>
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder="Name" required value={appForm.name} onChange={e => setAppForm({...appForm, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <input type="email" className="form-control" placeholder="Email" required value={appForm.email} onChange={e => setAppForm({...appForm, email: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <input type="tel" className="form-control" placeholder="10-Digit Phone Number" required pattern="[6-9][0-9]{9}" title="Enter a valid 10-digit Indian phone number starting with 6-9" value={appForm.phone} onChange={e => setAppForm({...appForm, phone: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Resume PDF (Required)</span>
                        <button type="button" onClick={() => {
                          const mockFile = new File(["%PDF-1.4 mock content"], "dummy.pdf", { type: "application/pdf" });
                          setResumeFile(mockFile);
                          setMessage("Developer Mode: Mock resume PDF attached!");
                        }} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                          [Attach Mock PDF]
                        </button>
                      </label>
                      <input type="file" className="form-control" accept=".pdf" required={!resumeFile} onChange={e => setResumeFile(e.target.files[0])} style={{ padding: '0.6rem' }} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Application</button>
                  </form>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '0.25rem', color: 'var(--success)', fontWeight: 600 }}>
                    Application Complete
                  </div>
                )}
              </>
            )}
            {user?.role === 'Recruiter' && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>
                You are viewing this listing as a recruiter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
