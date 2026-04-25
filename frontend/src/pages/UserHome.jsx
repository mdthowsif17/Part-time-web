import React, { useState, useEffect } from 'react';
import api from '../api';
import JobModal from '../components/JobModal';
import TAMILNADU_DISTRICTS from '../constants/districts';

export default function UserHome() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const fetchJobs = async (df, district) => {
    setLoading(true);
    try {
      let url = '/jobs';
      const params = [];
      if (df === 'today') params.push('filter=today');
      if (district && district !== 'all') params.push(`district=${encodeURIComponent(district)}`);
      if (params.length) url += '?' + params.join('&');
      const { data } = await api.get(url);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(dateFilter, districtFilter);
  }, [dateFilter, districtFilter]);

  const handleApplied = (jobId) => {
    setJobs(prev => prev.map(j =>
      j._id === jobId ? { ...j, applicantCount: (j.applicantCount || 0) + 1 } : j
    ));
  };

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <h1>Find Your <span>Daily</span> Part-Time Job</h1>
        <p>One-day gigs posted fresh every day — apply instantly!</p>
        <div className="hero-stats">
          <div className="hero-stat"><span>{jobs.length}</span><small>Active Jobs</small></div>
          <div className="hero-stat"><span>{jobs.filter(j => j.date === today).length}</span><small>Today's Jobs</small></div>
          <div className="hero-stat"><span>{jobs.reduce((acc, j) => acc + (j.applicantCount || 0), 0)}</span><small>Total Applied</small></div>
        </div>
      </div>

      <div className="page">

        {/* Filter Bar */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          {/* Date filters */}
          <div className="filter-bar" style={{ marginBottom: 0 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text2)', marginRight: '0.3rem' }}>📅 Date:</span>
            <button className={`filter-btn ${dateFilter === 'all' ? 'active' : ''}`} onClick={() => setDateFilter('all')}>
              All Upcoming
            </button>
            <button className={`filter-btn ${dateFilter === 'today' ? 'active' : ''}`} onClick={() => setDateFilter('today')}>
              Today Only
            </button>
          </div>

          {/* District filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>🗺️ District:</span>
            <select
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              style={{
                background: districtFilter !== 'all' ? 'var(--accent)' : 'var(--surface)',
                color: districtFilter !== 'all' ? '#0d0d0f' : 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '0.35rem 0.9rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                outline: 'none',
                fontWeight: districtFilter !== 'all' ? 600 : 400
              }}
            >
              <option value="all">All Districts</option>
              {TAMILNADU_DISTRICTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {districtFilter !== 'all' && (
              <button
                onClick={() => setDistrictFilter('all')}
                style={{
                  background: 'none', border: 'none', color: 'var(--red)',
                  cursor: 'pointer', fontSize: '0.82rem'
                }}
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        {(districtFilter !== 'all' || dateFilter !== 'all') && !loading && (
          <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '1rem' }}>
            Showing <strong style={{ color: 'var(--accent)' }}>{jobs.length}</strong> jobs
            {districtFilter !== 'all' && <> in <strong style={{ color: 'var(--accent)' }}>{districtFilter}</strong></>}
            {dateFilter === 'today' && <> for <strong style={{ color: 'var(--accent)' }}>today</strong></>}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <h3>No jobs found</h3>
            <p>
              {districtFilter !== 'all'
                ? `No jobs in ${districtFilter} ${dateFilter === 'today' ? 'today' : 'at the moment'}.`
                : 'No upcoming jobs at the moment.'}
            </p>
            {districtFilter !== 'all' && (
              <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => setDistrictFilter('all')}>
                Show All Districts
              </button>
            )}
          </div>
        ) : (
          <div className="job-grid">
            {jobs.map(job => (
              <div key={job._id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedJob(job)}>
                <div className="job-card-header">
                  <div>
                    {job.date === today && (
                      <span className="today-tag" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>Today</span>
                    )}
                    <div className="job-title">{job.title}</div>
                  </div>
                  <span className="salary-badge">₹{job.salary}</span>
                </div>

                <div className="job-meta">
                  <span>📅 {job.date}</span>
                  <span>🕐 {job.time}</span>
                  <span>⏱ {job.hoursOfWork} hrs</span>
                </div>
                <div className="job-meta" style={{ marginTop: '0.3rem' }}>
                  {job.district && (
                    <span style={{
                      background: 'rgba(245,197,24,0.1)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(245,197,24,0.25)',
                      borderRadius: '5px',
                      padding: '0.1rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      🗺️ {job.district}
                    </span>
                  )}
                  <span>📍 {job.location}</span>
                </div>

                <div className="job-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="employer-name">by {job.employerName}</span>
                    <span style={{
                      fontSize: '0.75rem',
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      borderRadius: '20px',
                      padding: '0.1rem 0.55rem',
                      color: job.applicantCount > 0 ? 'var(--accent2)' : 'var(--text2)'
                    }}>
                      👥 {job.applicantCount || 0} applied
                    </span>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); setSelectedJob(job); }}>
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedJob && (
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} onApplied={handleApplied} />
      )}
    </div>
  );
}
