import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RecruiterDashboard = () => {
  const { user } = useContext(AuthContext);
  const [myJobs, setMyJobs] = useState([]);
  const [stats, setStats] = useState({ jobsPosted: 0, applicationsReceived: 0, mostAppliedJob: 'N/A' });
  const [selectedJobApps, setSelectedJobApps] = useState([]);
  const [activeJobTitle, setActiveJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [editLogoFile, setEditLogoFile] = useState(null);
  const [editError, setEditError] = useState('');

  const fetchRecruiterData = async () => {
    try {
      const statsRes = await fetch('http://localhost:5000/api/jobs/recruiter/stats', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      const jobsRes = await fetch('http://localhost:5000/api/jobs?postedBy=me', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const jobsData = await jobsRes.json();
      if (jobsData.success) setMyJobs(jobsData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const handleViewApplications = async (jobId, title) => {
    setActiveJobTitle(title);
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/applications`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) setSelectedJobApps(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJobDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchRecruiterData();
        setSelectedJobApps([]);
        setActiveJobTitle('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (job) => {
    setEditingJob({ ...job });
    setEditLogoFile(null);
    setEditError('');
  };

  const handleEditInputChange = (e) => {
    setEditingJob({ ...editingJob, [e.target.name]: e.target.value });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    try {
      const editDataPayload = new FormData();
      editDataPayload.append('title', editingJob.title);
      editDataPayload.append('company', editingJob.company);
      editDataPayload.append('location', editingJob.location);
      editDataPayload.append('type', editingJob.type);
      editDataPayload.append('salary', editingJob.salary);
      editDataPayload.append('description', editingJob.description);
      if (editLogoFile) {
        editDataPayload.append('logo', editLogoFile);
      }

      const res = await fetch(`http://localhost:5000/api/jobs/${editingJob._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: editDataPayload
      });
      const data = await res.json();
      if (data.success) {
        setEditingJob(null);
        setEditLogoFile(null);
        fetchRecruiterData();
      } else {
        setEditError(data.message);
      }
    } catch (err) {
      setEditError('Connection failure. Unable to update the job details.');
    }
  };

  if (loading) return <div className="spinner-box"><div className="spinner"></div></div>;

  return (
    <div className="dashboard-layout">
      <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Recruiter Console</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage listings and view real-time pipeline performance analytics.</p>
      
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-val">{stats.jobsPosted}</div>
          <div className="stat-lbl">Active Campaigns</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{stats.applicationsReceived}</div>
          <div className="stat-lbl">Total Applicants Tracked</div>
        </div>
        <div className="stat-card">
          <div className="stat-val" style={{ fontSize: stats.mostAppliedJob && stats.mostAppliedJob.length > 15 ? '1.5rem' : '2.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingTop: stats.mostAppliedJob && stats.mostAppliedJob.length > 15 ? '0.5rem' : '0' }}>{stats.mostAppliedJob || 'N/A'}</div>
          <div className="stat-lbl">Most Applied Listing</div>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <h3>Your Performance Listings</h3>
          {myJobs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No job listings posted yet. Go ahead and create one.</p>
          ) : (
            <div className="grid-3" style={{ gridTemplateColumns: '1fr', marginTop: '1rem' }}>
              {myJobs.map(job => (
                <div key={job._id} style={{ border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {job.logoUrl ? (
                      <img src={`http://localhost:5000${job.logoUrl}`} alt="" style={{ width: '40px', height: '40px', borderRadius: '0.35rem', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '0.35rem', background: 'linear-gradient(135deg, var(--accent-indigo) 0%, var(--accent-blue) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
                        {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
                      </div>
                    )}
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{job.title}</h4>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{job.company} • {job.location} • ₹{job.salary ? job.salary.toLocaleString('en-IN') : '0'} / yr</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleViewApplications(job._id, job.title)} className="btn btn-secondary">Review</button>
                    <button onClick={() => handleEditClick(job)} className="btn btn-secondary" style={{ borderColor: 'var(--accent-indigo)', color: 'var(--accent-indigo)' }}>Edit</button>
                    <button onClick={() => handleJobDelete(job._id)} className="btn btn-danger">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3>Applicant Tracker {activeJobTitle && `[ ${activeJobTitle} ]`}</h3>
          <div style={{ marginTop: '1rem' }}>
            {!activeJobTitle ? (
              <p style={{ color: 'var(--text-muted)' }}>Select a listing context to inspect applicant details.</p>
            ) : selectedJobApps.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No incoming applications found matching this target listing.</p>
            ) : (
              selectedJobApps.map(app => (
                <div key={app._id} style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '0.375rem', marginBottom: '0.75rem', borderLeft: '3px solid var(--accent-blue)', borderTop: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 600 }}>{app.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Email: {app.email}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Phone: {app.phone}</div>
                  {app.resumeUrl && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <a 
                        href={`http://localhost:5000${app.resumeUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-secondary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'inline-flex' }}
                      >
                        📄 View Resume PDF
                      </a>
                    </div>
                  )}
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', marginTop: '0.75rem', textAlign: 'right', fontWeight: 600 }}>
                    Applied: {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Job Modal popup overlay */}
      {editingJob && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="auth-title" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>Edit Opportunity</h2>
            {editError && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{editError}</div>}
            <form onSubmit={handleEditFormSubmit}>
              <div className="form-group">
                <label>Opportunity Target Title</label>
                <input type="text" name="title" className="form-control" required value={editingJob.title} onChange={handleEditInputChange} />
              </div>
              <div className="form-group">
                <label>Company/Institution Name</label>
                <input type="text" name="company" className="form-control" required value={editingJob.company} onChange={handleEditInputChange} />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Company Logo Image (PNG / JPG)</span>
                  <button type="button" onClick={() => {
                    const b64Data = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAiklEQVR42mJgYGD4DwSgAgYmBgaGf1AMYIMsKAbx30D8/182AAMg/A8hAwwsQGzG8P//G4j//x+GjU0MDAxsDCAAAwNfQJbBf4B1kGBhYGD4H4oBBmCgZABb5P//NwA7wACoAdn/Y/0/ABuQzQA0AAHE/x8GBgYQ/P8fAAMAEB0B8S0b3qMAAAAASUVORK5CYII=";
                    const byteCharacters = atob(b64Data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const mockFile = new File([byteArray], "dummy.png", { type: "image/png" });
                    setEditLogoFile(mockFile);
                    setEditError("Developer Mode: Mock logo PNG attached!");
                  }} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                    [Attach Mock Logo]
                  </button>
                </label>
                <input type="file" className="form-control" accept="image/png, image/jpeg, image/jpg" onChange={e => setEditLogoFile(e.target.files[0])} style={{ padding: '0.6rem' }} />
              </div>
              <div className="form-group">
                <label>Geographic Placement (Location)</label>
                <input type="text" name="location" className="form-control" required value={editingJob.location} onChange={handleEditInputChange} />
              </div>
              <div className="form-group">
                <label>Structural Deployment Type</label>
                <select name="type" className="form-control" value={editingJob.type} onChange={handleEditInputChange}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div className="form-group">
                <label>Annual Salary (INR - ₹)</label>
                <input type="number" name="salary" className="form-control" placeholder="e.g. 1200000" required value={editingJob.salary} onChange={handleEditInputChange} />
              </div>
              <div className="form-group">
                <label>Requirements & Operational Description</label>
                <textarea name="description" rows="5" className="form-control" required value={editingJob.description} onChange={handleEditInputChange}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" onClick={() => setEditingJob(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
