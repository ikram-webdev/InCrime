import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) {
      setError('Please enter username and password');
      return;
    }
    setLoading(true);
    try {
      const res = await login(form.username, form.password);
      if (res.success) {
        navigate(res.user?.role === 'admin' ? '/admin' : from, { replace: true });
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box', padding: '11px 14px',
    border: '2px solid #e0e0e0', borderRadius: 8, fontSize: 15,
    fontFamily: "'Segoe UI', sans-serif", transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      margin: 0, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
        url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1920&auto=format&fit=crop') center/cover no-repeat fixed`,
      padding: '20px',
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .login-card { animation: fadeUp 0.5s ease; }
        input:focus { outline: none; border-color: #0d2a3a !important; box-shadow: 0 0 0 3px rgba(13,42,58,0.1); }
      `}</style>

      <div className="login-card" style={{
        background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '45px 40px', width: '100%', maxWidth: 400, textAlign: 'center',
      }}>
        <div style={{ fontSize: 42, marginBottom: 8 }}>⚖️</div>
        <h2 style={{ marginBottom: 5, fontSize: 26, color: '#0d2a3a' }}>Welcome Back</h2>
        <p style={{ color: '#888', marginBottom: 28, fontSize: 14 }}>Login to access InCrime</p>

        {error && (
          <div style={{ background: '#fff3f3', border: '1px solid #ffcdd2', color: '#c62828', padding: '10px 14px', borderRadius: 8, marginBottom: 18, fontSize: 14 }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="text" placeholder="Username or Email" value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              style={inputStyle} autoComplete="username"
              onFocus={e => e.target.style.borderColor = '#0d2a3a'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
          <div style={{ marginBottom: 10, position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'} placeholder="Password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ ...inputStyle, paddingRight: 44 }} autoComplete="current-password"
              onFocus={e => e.target.style.borderColor = '#0d2a3a'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
            <span
              onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#999', fontSize: 18 }}
            >
              {showPass ? '🙈' : '👁️'}
            </span>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 22 }}>
            <a href="/forgot-password" onClick={e => { e.preventDefault(); navigate('/forgot-password'); }}
              style={{ color: '#0d2a3a', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#999' : '#0d2a3a', color: 'white', border: 'none',
              padding: '13px', width: '100%', borderRadius: 8, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', fontSize: 16, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1a4763'; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#0d2a3a'; }}
          >
            {loading ? '⏳ Logging in...' : ' Login'}
          </button>
        </form>

        <div style={{ marginTop: 22, borderTop: '1px solid #f0f0f0', paddingTop: 18, fontSize: 14, color: '#666' }}>
          Don't have an account?{' '}
          <a href="/signup" onClick={e => { e.preventDefault(); navigate('/signup'); }}
            style={{ color: '#0d2a3a', fontWeight: 700, textDecoration: 'none' }}>
            Create Account
          </a>
        </div>

        {/* <p style={{ marginTop: 12, fontSize: 12, color: '#aaa' }}>
          Admin: username <strong>admin</strong> / password <strong>Admin@123456</strong>
        </p> */}
      </div>
    </div>
  );
}
