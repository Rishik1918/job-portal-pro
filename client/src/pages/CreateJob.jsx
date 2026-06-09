import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CreateJob = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setLogoFile(e.target.files[0]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const dataPayload = new FormData();
      dataPayload.append('title', formData.title);
      dataPayload.append('company', formData.company);
      dataPayload.append('location', formData.location);
      dataPayload.append('type', formData.type);
      dataPayload.append('salary', formData.salary);
      dataPayload.append('description', formData.description);
      if (logoFile) {
        dataPayload.append('logo', logoFile);
      }

      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }, // Do NOT set Content-Type for FormData
        body: dataPayload
      });
      const data = await res.json();
      if (data.success) {
        navigate('/recruiter-dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Network connection error. Failed to post the job opportunity.');
    }
  };

  return (
    <div className="auth-container" style={{ minHeight: 'auto', padding: '3rem 0' }}>
      <div className="auth-card" style={{ maxWidth: '640px' }}>
        <h2 className="auth-title">Post New Job Campaign</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label>Opportunity Target Title</label>
            <input type="text" name="title" className="form-control" placeholder="e.g. Senior Frontend Engineer" required value={formData.title} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Company/Institution Name</label>
            <input type="text" name="company" className="form-control" placeholder="e.g. Acme Corp" required value={formData.company} onChange={handleInputChange} />
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
                setLogoFile(mockFile);
                setError("Developer Mode: Mock logo PNG attached!");
              }} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                [Attach Mock Logo]
              </button>
            </label>
            <input type="file" name="logo" className="form-control" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} style={{ padding: '0.6rem' }} />
          </div>
          <div className="form-group">
            <label>Geographic Placement (Location)</label>
            <input type="text" name="location" className="form-control" placeholder="e.g. San Francisco, CA (Remote)" required value={formData.location} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Structural Deployment Type</label>
            <select name="type" className="form-control" value={formData.type} onChange={handleInputChange}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div className="form-group">
            <label>Annual Salary (INR - ₹)</label>
            <input type="number" name="salary" className="form-control" placeholder="e.g. 1200000 (12 Lakhs / yr)" required value={formData.salary} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Requirements & Operational Context Description</label>
            <textarea name="description" rows="7" className="form-control" placeholder="Detail the duties, requirements, and tech stack needed..." required value={formData.description} onChange={handleInputChange}></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Commit & Launch</button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
