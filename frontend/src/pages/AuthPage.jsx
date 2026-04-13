import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode = 'login' }) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : form;
      const { data } = await api.post(endpoint, payload);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-title">
        {isLogin ? <>Welcome <span>Back</span></> : <>Join <span>DailyJobs</span></>}
      </div>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
        </div>

        {!isLogin && (
          <>
            <div className="form-group">
              <label>Phone Number {form.role === 'user' ? '(Required for employers to contact you)' : '(Optional)'}</label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. 9876543210"
                value={form.phone}
                onChange={handleChange}
                required={form.role === 'user'}
              />
            </div>

            <div className="form-group">
              <label>I am a...</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="user">👤 Job Seeker (User)</option>
                <option value="employer">🏢 Employer</option>
              </select>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>

      <div className="form-footer">
        {isLogin ? (
          <>Don't have an account? <button onClick={() => { setIsLogin(false); setError(''); }}>Register</button></>
        ) : (
          <>Already have an account? <button onClick={() => { setIsLogin(true); setError(''); }}>Login</button></>
        )}
      </div>
    </div>
  );
}
