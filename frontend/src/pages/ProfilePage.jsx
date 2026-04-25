import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name cannot be empty'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      const { data } = await api.put('/auth/profile', form);
      // update auth context with new token + user
      login(data.token, data.user);
      setSuccess('Profile updated successfully! ✅');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-title">My <span>Profile</span></div>

      <div style={{ maxWidth: '460px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '1.75rem' }}>

          {/* Avatar / info */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            marginBottom: '1.5rem', paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border)'
          }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: 'rgba(245,197,24,0.15)',
              border: '2px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)',
              fontFamily: 'var(--font-head)'
            }}>
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{user?.email}</div>
              <span className={`nav-badge ${user?.role === 'employer' ? 'employer' : ''}`} style={{ marginTop: '0.25rem', display: 'inline-block' }}>
                {user?.role === 'employer' ? '🏢 Employer' : '👤 User'}
              </span>
            </div>
          </div>

          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text2)' }}>
            Edit Details
          </h3>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>📱 Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. 9876543210"
                value={form.phone}
                onChange={handleChange}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: '0.3rem' }}>
                {user?.role === 'user'
                  ? '⚠️ Employers contact you using this number — keep it updated!'
                  : 'Your contact number shown to job seekers'}
              </div>
            </div>

            {/* Email — read only */}
            <div className="form-group">
              <label>✉️ Email (cannot be changed)</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>

            <button type="button" className="btn btn-outline btn-full" style={{ marginTop: '0.5rem' }} onClick={() => navigate('/home')}>
              ← Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
