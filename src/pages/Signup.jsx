import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getStrength(val) {
  let score = 0;
  if (val.length >= 8 && val.length <= 16) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/\d/.test(val)) score++;
  if (/[!@#$%^&*]/.test(val)) score++;
  if (score <= 2) return { label: 'Weak password', color: '#e53935', width: '30%' };
  if (score === 3) return { label: 'Normal password', color: '#fb8c00', width: '65%' };
  return { label: 'Strong password', color: '#43a047', width: '100%' };
}

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: '', username: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const strength = form.password ? getStrength(form.password) : null;

  const inputStyle = {
    width: '100%', boxSizing: 'border-box', padding: '11px 14px',
    border: '2px solid #e0e0e0', borderRadius: 8, fontSize: 15,
    fontFamily: "'Segoe UI', sans-serif", transition: 'border-color 0.2s',
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name required';
    if (!form.username.trim()) e.username = 'Username required';
    if (!form.email && !form.phone) e.contact = 'Email or phone required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password required';
    else if (strength && strength.label !== 'Strong password') e.password = 'Please use a stronger password';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await register({
        fullName: form.fullName,
        username: form.username,
        email: form.email || undefined,
        phone: form.phone || undefined,
        password: form.password,
      });
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, type = 'text', placeholder, icon, extra }) => (
    <div style={{ marginBottom: 14 }}>
      <input
        type={type} placeholder={`${icon} ${placeholder}`}
        value={form[name]}
        onChange={e => { setForm({ ...form, [name]: e.target.value }); setErrors({}); }}
        style={{ ...inputStyle, ...(errors[name] ? { borderColor: '#e53935' } : {}) }}
        onFocus={e => e.target.style.borderColor = '#0d2a3a'}
        onBlur={e => { if (!errors[name]) e.target.style.borderColor = '#e0e0e0'; }}
        autoComplete={type === 'password' ? 'new-password' : name}
      />
      {extra}
      {errors[name] && <div style={{ color: '#e53935', fontSize: 12, marginTop: 3 }}>⚠️ {errors[name]}</div>}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
        url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1920&auto=format&fit=crop') center/cover no-repeat fixed`,
      padding: '20px',
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .signup-card { animation: fadeUp 0.5s ease; }
        input:focus { outline: none; }
      `}</style>

      <div className="signup-card" style={{
        background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '40px 35px', width: '100%', maxWidth: 420,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40 }}>⚖️</div>
          <h2 style={{ fontSize: 24, color: '#0d2a3a', margin: '8px 0 4px' }}>Create Account</h2>
          <p style={{ color: '#888', fontSize: 13 }}>Join InCrime to access legal templates</p>
        </div>

        {error && (
          <div style={{ background: '#fff3f3', border: '1px solid #ffcdd2', color: '#c62828', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input name="fullName" placeholder="Full Name" icon="" 
          style={{ ...inputStyle, marginBottom: 8, ...(errors.fullName ? { borderColor: '#e53935' } : {}) }}
              onFocus={e => e.target.style.borderColor = '#0d2a3a'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}/>
          <input name="username" placeholder="Username" icon=""
          style={{ ...inputStyle, marginBottom: 8, ...(errors.email ? { borderColor: '#e53935' } : {}) }}
              onFocus={e => e.target.style.borderColor = '#0d2a3a'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'} />

          <div style={{ marginBottom: 14 }}>
            <input type="email" placeholder="Email Address" value={form.email}
              onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({}); }}
              style={{ ...inputStyle, marginBottom: 8, ...(errors.email ? { borderColor: '#e53935' } : {}) }}
              onFocus={e => e.target.style.borderColor = '#0d2a3a'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
            <input type="tel" placeholder="Phone Number (optional)" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#0d2a3a'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
            {errors.contact && <div style={{ color: '#e53935', fontSize: 12, marginTop: 3 }}>⚠️ {errors.contact}</div>}
            {errors.email && <div style={{ color: '#e53935', fontSize: 12 }}>⚠️ {errors.email}</div>}
          </div>

          <div style={{ marginBottom: 6, position: 'relative' }}>
            <input type={showPass ? 'text' : 'password'} placeholder="Password"
              value={form.password}
              onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({}); }}
              style={{ ...inputStyle, paddingRight: 44, ...(errors.password ? { borderColor: '#e53935' } : {}) }}
              onFocus={e => e.target.style.borderColor = '#0d2a3a'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
            <span onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 18 }}>
              {showPass ? '🙈' : '👁️'}
            </span>
          </div>

          {strength && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ height: 4, background: '#f0f0f0', borderRadius: 2, marginBottom: 4 }}>
                <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: 2, transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: 12, color: strength.color, fontStyle: 'italic' }}>{strength.label}</div>
            </div>
          )}
          {errors.password && <div style={{ color: '#e53935', fontSize: 12, marginBottom: 8 }}>⚠️ {errors.password}</div>}

          <div style={{ marginBottom: 18, position: 'relative' }}>
            <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={e => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({}); }}
              style={{ ...inputStyle, paddingRight: 44, ...(errors.confirmPassword ? { borderColor: '#e53935' } : {}) }}
              onFocus={e => e.target.style.borderColor = '#0d2a3a'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
            <span onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 18 }}>
              {showConfirm ? '🙈' : '👁️'}
            </span>
            {errors.confirmPassword && <div style={{ color: '#e53935', fontSize: 12, marginTop: 3 }}>⚠️ {errors.confirmPassword}</div>}
          </div>

          <p style={{ fontSize: 11, color: '#999', marginBottom: 16, fontStyle: 'italic', textAlign: 'center' }}>
            Password: 8-16 chars with uppercase, number & special character (!@#$%^&*)
          </p>

          <button type="submit" disabled={loading} style={{
            background: loading ? '#999' : '#0d2a3a', color: 'white', border: 'none',
            padding: 13, width: '100%', borderRadius: 8, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', fontSize: 16,
          }}>
            {loading ? '⏳ Creating...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#666' }}>
          Already have an account?{' '}
          <a href="/login" onClick={e => { e.preventDefault(); navigate('/login'); }}
            style={{ color: '#0d2a3a', fontWeight: 700, textDecoration: 'none' }}>Login</a>
        </div>
      </div>
    </div>
  );
}
