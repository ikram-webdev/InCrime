import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ links, showLogin = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const defaultLinks = [
    { label: 'Home', to: '/' },
    { label: 'Case Categories', to: '/#categories' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'Chatbot', to: '/chatbot' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/#contact' },
  ];

  const navLinks = links || defaultLinks;

  const handleNav = (to) => {
    setMenuOpen(false);
    if (to.startsWith('/#')) {
      if (location.pathname !== '/') navigate('/');
      setTimeout(() => {
        const id = to.replace('/#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(to);
    }
  };

  return (
    <>
      <style>{`
        .incrime-nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px 60px; background: rgba(13,42,58,0.97); color: #fff;
          box-shadow: 0 3px 10px rgba(0,0,0,0.3); position: sticky; top: 0;
          z-index: 1000; backdrop-filter: blur(10px); box-sizing: border-box;
        }
        .nav-logo { font-size: 24px; font-weight: bold; cursor: pointer; letter-spacing: 1px; white-space: nowrap; }
        .nav-links { list-style: none; display: flex; gap: 22px; margin: 0; padding: 0; }
        .nav-link-item a { text-decoration: none; color: #fff; font-weight: 500; font-size: 14px; transition: color 0.2s; white-space: nowrap; }
        .nav-link-item a:hover { color: #FFD700; }
        .nav-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .btn-login { background: #FFD700; border: none; color: #0d2a3a; padding: 8px 18px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 14px; transition: all 0.2s; }
        .btn-login:hover { background: #e6c200; transform: translateY(-1px); }
        .user-badge { background: rgba(255,215,0,0.15); border: 1px solid #FFD700; border-radius: 6px; padding: 6px 14px; color: #FFD700; font-weight: 600; font-size: 13px; cursor: pointer; position: relative; white-space: nowrap; }
        .user-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: #fff; border-radius: 10px; box-shadow: 0 8px 25px rgba(0,0,0,0.15); min-width: 190px; overflow: hidden; z-index: 2001; }
        .user-dropdown a, .user-dropdown button { display: block; width: 100%; padding: 12px 18px; text-align: left; border: none; background: none; cursor: pointer; color: #0d2a3a; font-size: 14px; text-decoration: none; font-weight: 500; transition: background 0.2s; box-sizing: border-box; }
        .user-dropdown a:hover, .user-dropdown button:hover { background: #f5f5f5; }
        .hamburger { display: none; background: none; border: none; color: #fff; font-size: 26px; cursor: pointer; padding: 4px; line-height: 1; }

        /* Mobile drawer — hidden by default on ALL screen sizes via inline style control */
        .mobile-drawer {
          position: fixed; top: 0; right: 0; width: 280px; height: 100vh;
          background: #0d2a3a; z-index: 3000; padding: 70px 30px 30px;
          box-sizing: border-box; overflow-y: auto;
          box-shadow: -4px 0 20px rgba(0,0,0,0.4);
        }
        .mobile-drawer ul { list-style: none; padding: 0; margin: 0; }
        .mobile-drawer ul li { padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .mobile-drawer ul li a { color: #fff; text-decoration: none; font-size: 16px; font-weight: 500; display: block; }
        .mobile-drawer ul li a:hover { color: #FFD700; }
        .mobile-drawer ul li button { color: #fff; font-size: 16px; font-weight: 500; background: none; border: none; cursor: pointer; padding: 0; font-family: inherit; }
        .mobile-drawer ul li button:hover { color: #FFD700; }
        .mobile-close-btn { position: absolute; top: 18px; right: 18px; background: rgba(255,255,255,0.1); border: none; color: #fff; font-size: 20px; cursor: pointer; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
        .mobile-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 2999; }

        @media (max-width: 900px) {
          .incrime-nav { padding: 15px 20px; }
          .nav-links { display: none !important; }
          .hamburger { display: block; }
        }
        @media (min-width: 901px) {
          .hamburger { display: none !important; }
        }
      `}</style>

      <nav className="incrime-nav">
        <div className="nav-logo" onClick={() => navigate('/')}>⚖️ InCrime</div>

        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.label} className="nav-link-item">
              <a href={link.to} onClick={e => { e.preventDefault(); handleNav(link.to); }}>
                {link.label}
              </a>
            </li>
          ))}
          {isAdmin && (
            <li className="nav-link-item">
              <a href="/admin" onClick={e => { e.preventDefault(); navigate('/admin'); }}>
                🛡️ Admin
              </a>
            </li>
          )}
        </ul>

        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="user-badge" onClick={() => setDropdownOpen(!dropdownOpen)}>
              👤 {user?.username} ▾
              {dropdownOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 2000 }} onClick={() => setDropdownOpen(false)} />
                  <div className="user-dropdown" onClick={e => e.stopPropagation()}>
                    <a href="/my-applications" onClick={e => { e.preventDefault(); navigate('/my-applications'); setDropdownOpen(false); }}>📋 My Applications</a>
                    {isAdmin && <a href="/admin" onClick={e => { e.preventDefault(); navigate('/admin'); setDropdownOpen(false); }}>🛡️ Admin Panel</a>}
                    <button onClick={() => { logout(); navigate('/login'); setDropdownOpen(false); }}>🚪 Logout</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            showLogin && (
              <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
            )
          )}
          <button className="hamburger" onClick={() => setMenuOpen(true)}>☰</button>
        </div>
      </nav>

      {/* Mobile Drawer — only rendered when open */}
      {menuOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
          <div className="mobile-drawer">
            <button className="mobile-close-btn" onClick={() => setMenuOpen(false)}>✕</button>
            <div style={{ marginBottom: 20, color: '#FFD700', fontSize: 18, fontWeight: 800 }}>⚖️ InCrime</div>
            <ul>
              {navLinks.map(link => (
                <li key={link.label}>
                  <a href={link.to} onClick={e => { e.preventDefault(); handleNav(link.to); }}>
                    {link.label}
                  </a>
                </li>
              ))}
              {isAdmin && (
                <li>
                  <a href="/admin" onClick={e => { e.preventDefault(); navigate('/admin'); setMenuOpen(false); }}>🛡️ Admin Panel</a>
                </li>
              )}
              {isAuthenticated ? (
                <>
                  <li>
                    <a href="/my-applications" onClick={e => { e.preventDefault(); navigate('/my-applications'); setMenuOpen(false); }}>📋 My Applications</a>
                  </li>
                  <li>
                    <button onClick={() => { logout(); navigate('/login'); setMenuOpen(false); }}>🚪 Logout</button>
                  </li>
                </>
              ) : (
                <li style={{ paddingTop: 16 }}>
                  <button
                    onClick={() => { navigate('/login'); setMenuOpen(false); }}
                    style={{ background: '#FFD700', color: '#0d2a3a', border: 'none', padding: '11px 24px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', width: '100%', fontSize: 15 }}
                  >
                    Login
                  </button>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
