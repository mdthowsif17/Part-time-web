import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'user') { navigate('/'); return; }
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/apply/mine');
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="page">
      <div className="page-title">My <span>Applications</span></div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <h3>No applications yet</h3>
          <p>Browse jobs and apply to get started!</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="job-grid">
          {applications.map(app => {
            const job = app.jobId;
            if (!job) return null;
            const isToday = job.date === today;
            const isPast = job.date < today;
            return (
              <div key={app._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    {isToday && <span className="today-tag" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>Today</span>}
                    <div className="job-title" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{job.title}</div>
                    <div className="job-meta">
                      <span>📅 {job.date}</span>
                      <span>🕐 {job.time}</span>
                      <span>📍 {job.location}</span>
                      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{job.salary}</span>
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text2)' }}>
                      by {job.employerName}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                    <span className="app-status">✓ Applied</span>
                    {isPast && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text2)', background: 'var(--surface2)', padding: '0.15rem 0.5rem', borderRadius: '5px' }}>
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text2)' }}>
                  Applied on {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
