import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function JobModal({ job, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');

  const today = new Date().toISOString().split('T')[0];
  const isToday = job.date === today;

  useEffect(() => {
    const checkApplied = async () => {
      if (!user || user.role !== 'user') { setChecking(false); return; }
      try {
        const { data } = await api.get(`/apply/check/${job._id}`);
        setApplied(data.applied);
      } catch {}
      setChecking(false);
    };
    checkApplied();
  }, [job._id, user]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    setMsg('');
    try {
      await api.post('/apply', { jobId: job._id });
      setApplied(true);
      setMsgType('success');
      setMsg('Applied successfully! 🎉 Employer will contact you.');
    } catch (err) {
      setMsgType('error');
      setMsg(err.response?.data?.message || 'Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          {isToday && <span className="today-tag">Today</span>}
          <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Posted by {job.employerName}</span>
        </div>

        <div className="modal-title">{job.title}</div>

        <div className="detail-grid">
          <div className="detail-item">
            <label>📅 Date</label>
            <span>{job.date}</span>
          </div>
          <div className="detail-item">
            <label>🕐 Time</label>
            <span>{job.time}</span>
          </div>
          <div className="detail-item">
            <label>📍 Location</label>
            <span>{job.location}</span>
          </div>
          <div className="detail-item">
            <label>💰 Salary</label>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{job.salary}</span>
          </div>
        </div>

        {/* Employer Contact Details */}
        {(job.contactPhone || job.contactEmail) && (
          <div style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '0.75rem 1rem',
            marginTop: '0.5rem'
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: '0.4rem', fontWeight: 600 }}>
              📞 Employer Contact
            </div>
            {job.contactPhone && (
              <div style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                📱 <a href={`tel:${job.contactPhone}`} style={{ color: 'var(--accent)' }}>{job.contactPhone}</a>
              </div>
            )}
            {job.contactEmail && (
              <div style={{ fontSize: '0.9rem' }}>
                ✉️ <a href={`mailto:${job.contactEmail}`} style={{ color: 'var(--accent)' }}>{job.contactEmail}</a>
              </div>
            )}
          </div>
        )}

        {msg && (
          <div className={msgType === 'success' ? 'form-success' : 'form-error'} style={{ marginTop: '0.75rem' }}>
            {msg}
          </div>
        )}

        {/* User details reminder after apply */}
        {applied && user?.role === 'user' && (
          <div style={{
            background: 'rgba(34,197,94,0.07)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 'var(--radius)',
            padding: '0.75rem 1rem',
            marginTop: '0.5rem',
            fontSize: '0.85rem'
          }}>
            <div style={{ fontWeight: 600, color: 'var(--green)', marginBottom: '0.3rem' }}>Your details sent to employer:</div>
            <div>👤 {user.name}</div>
            {user.phone && <div>📱 {user.phone}</div>}
            <div>✉️ {user.email}</div>
          </div>
        )}

        {user?.role === 'user' && !checking && (
          <div style={{ marginTop: '1rem' }}>
            {applied ? (
              <button className="btn btn-success btn-full">✓ Already Applied</button>
            ) : (
              <button className="btn btn-primary btn-full" onClick={handleApply} disabled={loading}>
                {loading ? 'Applying...' : 'Apply for this Job'}
              </button>
            )}
          </div>
        )}

        {!user && (
          <div style={{ marginTop: '1rem' }}>
            <button className="btn btn-primary btn-full" onClick={() => navigate('/login')}>
              Login to Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
