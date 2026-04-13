import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // already logged in → go home
  if (user) {
    navigate('/home');
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav className="navbar">
        <div className="navbar-brand">Daily<span>Jobs</span></div>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>Register Free</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(245,197,24,0.08) 0%, transparent 70%)'
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(245,197,24,0.1)',
          border: '1px solid rgba(245,197,24,0.3)',
          borderRadius: '20px',
          padding: '0.35rem 1rem',
          fontSize: '0.82rem',
          color: 'var(--accent)',
          fontWeight: 600,
          marginBottom: '1.75rem',
          animation: 'fadeUp 0.5s ease both'
        }}>
          <span style={{ width: '7px', height: '7px', background: 'var(--accent)', borderRadius: '50%', display: 'inline-block' }} />
          India's Daily Part-Time Job Platform
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(2.2rem, 6vw, 4rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '1.25rem',
          animation: 'fadeUp 0.5s ease 0.1s both'
        }}>
          Find Work.<br />
          <span style={{ color: 'var(--accent)' }}>Get Hired Today.</span>
        </h1>

        <p style={{
          color: 'var(--text2)',
          fontSize: '1.05rem',
          maxWidth: '480px',
          lineHeight: 1.7,
          marginBottom: '2.25rem',
          animation: 'fadeUp 0.5s ease 0.2s both'
        }}>
          One-day gigs posted fresh every morning. Apply instantly, get paid same day. No experience needed.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '3.5rem',
          animation: 'fadeUp 0.5s ease 0.3s both'
        }}>
          <button
            className="btn btn-primary"
            style={{ padding: '0.8rem 2rem', fontSize: '1rem', fontWeight: 700 }}
            onClick={() => navigate('/register')}
          >
            👤 Find a Job
          </button>
          <button
            className="btn btn-outline"
            style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
            onClick={() => navigate('/register')}
          >
            🏢 Post a Job
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '3rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '3.5rem',
          animation: 'fadeUp 0.5s ease 0.4s both'
        }}>
          {[
            { num: '500+', label: 'Jobs Posted' },
            { num: '2,000+', label: 'Workers Hired' },
            { num: '100%', label: 'Free to Use' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>
                {s.num}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          maxWidth: '700px',
          width: '100%',
          animation: 'fadeUp 0.5s ease 0.5s both'
        }}>
          {[
            { icon: '⚡', title: 'One-Day Gigs', desc: 'Work today, get paid today. No long commitments.' },
            { icon: '🎯', title: 'Instant Apply', desc: 'One click apply. Employer contacts you directly.' },
            { icon: '🏢', title: 'Hire Fast', desc: 'Post in 60 seconds. Find workers same day.' },
          ].map(f => (
            <div key={f.title} className="card" style={{ textAlign: 'left', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{f.icon}</div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: '0.3rem' }}>{f.title}</div>
              <div style={{ fontSize: '0.83rem', color: 'var(--text2)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '1.25rem',
        borderTop: '1px solid var(--border)',
        fontSize: '0.82rem',
        color: 'var(--text2)'
      }}>
        © 2024 DailyJobs · Built with ❤️ for Tamil Nadu's workforce
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
