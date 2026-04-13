import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function EmployerHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openJobId, setOpenJobId] = useState(null);
  const [applicantsMap, setApplicantsMap] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/jobs/employer/myjobs');
      setMyJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchMyJobs error:', err);
      setError('Failed to load jobs. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job? All applications will also be removed.')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setMyJobs(prev => prev.filter(j => j._id !== jobId));
      if (openJobId === jobId) setOpenJobId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleToggleApplicants = async (jobId) => {
    if (openJobId === jobId) { setOpenJobId(null); return; }
    setOpenJobId(jobId);
    if (applicantsMap[jobId]) return;
    setLoadingId(jobId);
    try {
      const { data } = await api.get(`/jobs/${jobId}/applicants`);
      setApplicantsMap(prev => ({ ...prev, [jobId]: Array.isArray(data) ? data : [] }));
      setMyJobs(prev => prev.map(j =>
        j._id === jobId ? { ...j, applicantCount: data.length } : j
      ));
    } catch (err) {
      console.error('applicants error:', err);
    } finally {
      setLoadingId(null);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const totalApplicants = myJobs.reduce((acc, j) => acc + (j.applicantCount || 0), 0);

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <h1>Welcome, <span>{user?.name || 'Employer'}</span> 👋</h1>
        <p>Manage your job postings and track applicants in real-time.</p>
        <div className="hero-stats">
          <div className="hero-stat"><span>{myJobs.length}</span><small>Jobs Posted</small></div>
          <div className="hero-stat"><span>{totalApplicants}</span><small>Total Applicants</small></div>
          <div className="hero-stat"><span>{myJobs.filter(j => j.date === today).length}</span><small>Today's Jobs</small></div>
        </div>
      </div>

      <div className="page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div className="page-title" style={{ margin: 0 }}>Your <span>Job Posts</span></div>
          <button className="btn btn-primary" onClick={() => navigate('/post-job')}>+ Post New Job</button>
        </div>

        {/* Error state */}
        {error && (
          <div className="form-error" style={{ marginBottom: '1rem' }}>
            ⚠️ {error}
            <button onClick={fetchMyJobs} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.85rem' }}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading your jobs...</div>
        ) : myJobs.length === 0 ? (
          <div className="empty-state">
            <h3>No jobs posted yet</h3>
            <p>Post your first job and start receiving applications!</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/post-job')}>
              + Post a Job
            </button>
          </div>
        ) : (
          <div className="job-grid">
            {myJobs.map(job => {
              const jobApplicants = applicantsMap[job._id] || [];
              const isOpen = openJobId === job._id;
              const isLoadingThis = loadingId === job._id;
              const count = job.applicantCount || 0;

              return (
                <div key={job._id}>
                  <div className="card" style={{ borderRadius: isOpen ? '10px 10px 0 0' : undefined }}>
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
                      {job.hoursOfWork && <span>⏱ {job.hoursOfWork} hrs</span>}
                      <span>📍 {job.location}</span>
                    </div>

                    {job.contactPhone && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginTop: '0.4rem' }}>
                        📱 {job.contactPhone}
                      </div>
                    )}

                    {/* Live Applicant Count */}
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.65rem 1rem',
                      background: count > 0 ? 'rgba(245,197,24,0.08)' : 'var(--surface2)',
                      border: `1px solid ${count > 0 ? 'rgba(245,197,24,0.3)' : 'var(--border)'}`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: count > 0 ? 'var(--accent)' : 'var(--text2)' }}>
                        👥 {count} {count === 1 ? 'Applicant' : 'Applicants'}
                      </span>
                      {count > 0 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--green)', fontWeight: 600 }}>● Live</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ flex: 1 }}
                        onClick={() => handleToggleApplicants(job._id)}
                      >
                        {isOpen ? '▲ Hide Applicants' : `👤 View Applicants${count > 0 ? ` (${count})` : ''}`}
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.3)' }}
                        onClick={() => handleDelete(job._id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>

                  {/* Applicants Panel */}
                  {isOpen && (
                    <div style={{
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      borderTop: 'none',
                      borderRadius: '0 0 10px 10px',
                      padding: '1rem 1.25rem'
                    }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text2)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Applicant Details
                      </div>

                      {isLoadingThis ? (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Loading...</div>
                      ) : jobApplicants.length === 0 ? (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>No applications received yet.</div>
                      ) : (
                        jobApplicants.map((app, i) => (
                          <div key={app._id} style={{
                            padding: '0.7rem 0',
                            borderBottom: i < jobApplicants.length - 1 ? '1px solid var(--border)' : 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '1rem'
                          }}>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                                👤 {app.userName}
                              </div>
                              {app.userPhone && (
                                <div style={{ fontSize: '0.83rem', color: 'var(--text2)', marginBottom: '0.1rem' }}>
                                  📱 <a href={`tel:${app.userPhone}`} style={{ color: 'var(--accent)' }}>{app.userPhone}</a>
                                </div>
                              )}
                              {app.userEmail && (
                                <div style={{ fontSize: '0.83rem', color: 'var(--text2)' }}>
                                  ✉️ <a href={`mailto:${app.userEmail}`} style={{ color: 'var(--accent)' }}>{app.userEmail}</a>
                                </div>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text2)', whiteSpace: 'nowrap' }}>
                              {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
