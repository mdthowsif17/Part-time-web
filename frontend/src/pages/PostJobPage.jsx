import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function PostJobPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', date: '', time: '', hoursOfWork: '',
    location: '', salary: '', contactPhone: '', contactEmail: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user || user.role !== 'employer') { navigate('/'); return; }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await api.post('/jobs', {
        ...form,
        salary: Number(form.salary),
        hoursOfWork: Number(form.hoursOfWork)
      });
      setSuccess('Job posted successfully! ✅');
      setForm({ title: '', date: '', time: '', hoursOfWork: '', location: '', salary: '', contactPhone: '', contactEmail: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-title">Post a <span>Job</span></div>

      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontFamily: 'var(--font-head)', marginBottom: '1.25rem', fontSize: '1rem' }}>
            New Job Posting
          </h3>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label>Job Title</label>
              <input name="title" placeholder="e.g. Warehouse Helper, Event Staff" value={form.title} onChange={handleChange} required />
            </div>

            {/* Date + Time */}
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" min={today} value={form.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input type="time" name="time" value={form.time} onChange={handleChange} required />
              </div>
            </div>

            {/* Hours of Work + Salary */}
            <div className="form-row">
              <div className="form-group">
                <label>⏱ Hours of Work</label>
                <select name="hoursOfWork" value={form.hoursOfWork} onChange={handleChange} required>
                  <option value="">Select hours</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(h => (
                    <option key={h} value={h}>{h} {h === 1 ? 'hour' : 'hours'}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>💰 Salary (₹ per day)</label>
                <input type="number" name="salary" placeholder="e.g. 800" min="1" value={form.salary} onChange={handleChange} required />
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label>📍 Location</label>
              <input name="location" placeholder="e.g. Anna Nagar, Chennai" value={form.location} onChange={handleChange} required />
            </div>

            {/* Contact */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: '0.75rem', fontWeight: 600 }}>
                📞 Contact Details (shown to applicants)
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="contactPhone" placeholder="9876543210" value={form.contactPhone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Email (Optional)</label>
                  <input type="email" name="contactEmail" placeholder="you@email.com" value={form.contactEmail} onChange={handleChange} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Posting...' : '+ Post Job'}
            </button>

            <button
              type="button"
              className="btn btn-outline btn-full"
              style={{ marginTop: '0.5rem' }}
              onClick={() => navigate('/home')}
            >
              ← Back to Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
