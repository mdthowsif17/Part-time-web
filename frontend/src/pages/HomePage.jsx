import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import JobModal from '../components/JobModal';

export default function HomePage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const fetchJobs = async (f) => {
    setLoading(true);
    try {
      const url = f === 'today' ? '/jobs?filter=today' : '/jobs';
      const { data } = await api.get(url);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(filter); }, [filter]);

  return (
    <div>
      <div className="hero">
        <h1>Find Your <span>Daily</span> Part-Time Job</h1>
        <p>One-day gigs posted fresh every day. Apply instantly.</p>
        <div className="hero-stats">
          <div className="hero-stat"><span>{jobs.length}</span><small>Active Jobs</small></div>
          <div className="hero-stat"><span>{jobs.filter(j => j.date === today).length}</span><small>Today's Jobs</small></div>
        </div>
      </div>

      <div className="page">
        <div className="filter-bar">
          <span style={{ fontSize: '0.85rem', color: 'var(--text2)', marginRight: '0.3rem' }}>Filter:</span>
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Upcoming</button>
          <button className={`filter-btn ${filter === 'today' ? 'active' : ''}`} onClick={() => setFilter('today')}>📅 Today Only</button>
        </div>

        {loading ? (
          <div className="loading">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <h3>No jobs found</h3>
            <p>{filter === 'today' ? 'No jobs posted for today yet.' : 'No upcoming jobs at the moment.'}</p>
          </div>
        ) : (
          <div className="job-grid">
            {jobs.map(job => (
              <div key={job._id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedJob(job)}>
                <div className="job-card-header">
                  <div>
                    {job.date === today && <span className="today-tag" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>Today</span>}
                    <div className="job-title">{job.title}</div>
                  </div>
                  <span className="salary-badge">₹{job.salary}</span>
                </div>
                <div className="job-meta">
                  <span>📅 {job.date}</span>
                  <span>🕐 {job.time}</span>
                  <span>📍 {job.location}</span>
                </div>
                <div className="job-footer">
                  <span className="employer-name">by {job.employerName}</span>
                  <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); setSelectedJob(job); }}>
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}
