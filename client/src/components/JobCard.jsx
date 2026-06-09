import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, showActions, onDeleteClick }) => {
  return (
    <div className="job-card">
      <div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
          {job.logoUrl ? (
            <img 
              src={`http://localhost:5000${job.logoUrl}`} 
              alt={`${job.company} Logo`} 
              style={{ width: '48px', height: '48px', borderRadius: '0.5rem', objectFit: 'cover', border: '1px solid var(--border-color)' }} 
            />
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: '0.5rem', background: 'linear-gradient(135deg, var(--accent-indigo) 0%, var(--accent-blue) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', color: '#fff' }}>
              {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
            </div>
          )}
          <div>
            <div className="job-meta" style={{ marginBottom: '0.15rem' }}>{job.type}</div>
            <h3 className="job-title" style={{ margin: 0, fontSize: '1.25rem', letterSpacing: '-0.25px' }}>{job.title}</h3>
          </div>
        </div>
        <div className="job-company" style={{ marginBottom: '1rem' }}>{job.company} • {job.location}</div>
        <div className="job-tags">
          <span className="tag">₹{job.salary ? job.salary.toLocaleString('en-IN') : '0'} / year</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <Link to={`/jobs/${job._id}`} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
          Details
        </Link>
        {showActions && (
          <button onClick={() => onDeleteClick(job._id)} className="btn btn-danger">
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
