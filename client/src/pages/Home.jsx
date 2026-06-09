import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (type) params.type = type;
      if (minSalary) params.minSalary = minSalary;
      if (maxSalary) params.maxSalary = maxSalary;
      if (sort) params.sort = sort;
      params.page = page;
      params.limit = '6';

      const query = new URLSearchParams(params);
      const res = await fetch(`http://localhost:5000/api/jobs?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
        setTotalPages(data.pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [type, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleClearFilters = async () => {
    setSearch('');
    setLocation('');
    setType('');
    setMinSalary('');
    setMaxSalary('');
    setSort('newest');
    setPage(1);
    
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/jobs?page=1&limit=6&sort=newest`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
        setTotalPages(data.pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <form className="search-filter-box" onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'stretch' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="search-input-group" style={{ flex: '2', minWidth: '280px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by role title, company keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-select-group" style={{ flex: '1', minWidth: '180px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Location (e.g. Mumbai, Remote)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div className="filter-select-group" style={{ flex: '1', minWidth: '150px' }}>
            <select className="form-control" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div className="filter-select-group" style={{ flex: '1', minWidth: '150px' }}>
            <input
              type="number"
              className="form-control"
              placeholder="Min Salary (₹)"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
            />
          </div>
          <div className="filter-select-group" style={{ flex: '1', minWidth: '150px' }}>
            <input
              type="number"
              className="form-control"
              placeholder="Max Salary (₹)"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
            />
          </div>
          <div className="filter-select-group" style={{ flex: '1', minWidth: '150px' }}>
            <select className="form-control" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="salary_high">Salary: High → Low</option>
              <option value="salary_low">Salary: Low → High</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>Query</button>
            <button type="button" onClick={handleClearFilters} className="btn btn-secondary" style={{ padding: '0.85rem 1.25rem' }}>Clear</button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="spinner-box"><div className="spinner"></div></div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No jobs found matching your criteria.
        </div>
      ) : (
        <>
          <div className="grid-3">
            {jobs.map(job => <JobCard key={job._id} job={job} />)}
          </div>
          <div className="pagination-wrap">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="page-btn">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)} className={`page-btn ${page === i + 1 ? 'active' : ''}`}>
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)} className="page-btn">Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
