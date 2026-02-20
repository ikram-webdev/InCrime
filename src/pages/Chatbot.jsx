import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const COLORS = { primaryDark: '#0d2a3a', accentGold: '#FFD700' };

export default function Chatbot() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('crime_chats')) || []; } catch { return []; }
  });
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages, isTyping]);

  const saveSessions = (s) => { setSessions(s); localStorage.setItem('crime_chats', JSON.stringify(s)); };

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setInputText('');
    setIsActive(false);
  };

  const loadSession = (id) => {
    const s = sessions.find(x => x.id === id);
    if (!s) return;
    setCurrentSessionId(id);
    setMessages(s.messages);
    setIsActive(true);
    setSidebarOpen(false);
  };

  const deleteSession = (id) => {
    const ns = sessions.filter(s => s.id !== id);
    saveSessions(ns);
    if (currentSessionId === id) startNewChat();
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text) return;

    setIsActive(true);
    const sessId = currentSessionId || Date.now();
    setCurrentSessionId(sessId);

    const userMsg = { role: 'user', text, time: new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }) };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInputText('');
    setIsTyping(true);

    let updatedSessions = [...sessions];
    let session = updatedSessions.find(x => x.id === sessId);
    if (!session) {
      session = { id: sessId, title: text.slice(0, 30), messages: [] };
      updatedSessions = [session, ...updatedSessions];
    }
    session.messages = [...session.messages, userMsg];

    try {
      const { data } = await axios.post('/api/chatbot/message', { message: text });
      const botMsg = {
        role: 'bot',
        text: data.response,
        time: new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
      };
      const finalMsgs = [...updatedMsgs, botMsg];
      setMessages(finalMsgs);
      session.messages = [...session.messages, botMsg];
      saveSessions(updatedSessions.map(s => s.id === sessId ? session : s));
    } catch (err) {
      const errMsg = { role: 'bot', text: 'Sorry, I could not process your request. Please try again.', time: '' };
      setMessages([...updatedMsgs, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert('Voice recognition not supported in this browser');
    const recognition = new SR();
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => { setInputText(e.results[0][0].transcript); recognition.stop(); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const bg = darkMode ? '#0f1115' : '#fff';
  const textColor = darkMode ? '#e5e7eb' : '#333';

  const suggestions = [
    'How to file a bail application?',
    'What is Nikah Nama?',
    'How to report theft to police?',
    'What is Dar-ul-Aman?',
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: bg, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', color: textColor }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Mini Sidebar */}
        <div style={{ width: 56, background: COLORS.primaryDark, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10, gap: 20, flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: COLORS.accentGold, fontSize: 24, marginTop: 10 }} title="Menu">☰</button>
          <button onClick={startNewChat} title="New Chat" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={22} height={22}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>
          </button>
          <button onClick={() => setDarkMode(!darkMode)} title="Toggle Dark Mode" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          </button>
          <button onClick={() => setSidebarOpen(true)} title="Chat History" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={22} height={22}><polyline points="1 4 1 10 7 10"/><path d="M3.5 15a9 9 0 102.1-9.4"/><path d="M12 7v5l4 2"/></svg>
          </button>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <>
            <div onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 999 }} />
            <aside style={{ position: 'absolute', left: 56, top: 0, width: 280, height: '100%', background: '#f6f7f8', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', padding: 20, zIndex: 1000, boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 700, color: '#0d2a3a' }}>Chat History</span>
                <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666' }}>✕</button>
              </div>
              <button onClick={startNewChat} style={{ background: COLORS.primaryDark, color: '#fff', border: 'none', padding: 12, borderRadius: 8, cursor: 'pointer', fontWeight: 600, marginBottom: 15 }}>＋ New Chat</button>
              <ul style={{ listStyle: 'none', padding: 0, flex: 1, overflowY: 'auto' }}>
                {sessions.length === 0 && <li style={{ color: '#999', fontSize: 13, textAlign: 'center', marginTop: 20 }}>No chat history yet</li>}
                {sessions.map(s => (
                  <li key={s.id} style={{ padding: '10px 12px', borderRadius: 8, marginBottom: 5, cursor: 'pointer', fontSize: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: currentSessionId === s.id ? '#eceef0' : 'transparent' }}>
                    <span onClick={() => loadSession(s.id)} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, color: '#333' }}>💬 {s.title}</span>
                    <button onClick={() => deleteSession(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', marginLeft: 8 }}>✕</button>
                  </li>
                ))}
              </ul>
            </aside>
          </>
        )}

        {/* Main Chat Area */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: bg, overflow: 'hidden' }}>
          {!isActive && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>⚖️</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: darkMode ? COLORS.accentGold : COLORS.primaryDark, marginBottom: 8 }}>
                InCrime Legal AI Assistant
              </h2>
              <p style={{ color: '#888', maxWidth: 400, lineHeight: 1.6, marginBottom: 30, fontSize: 14 }}>
                Ask me anything about Pakistani law — bail applications, family cases, FIR drafting, and more.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 600 }}>
                {suggestions.map(s => (
                  <button key={s} onClick={() => { setInputText(s); textareaRef.current?.focus(); }}
                    style={{ background: darkMode ? '#23262d' : '#f0f2f5', border: `1px solid ${darkMode ? '#333' : '#ddd'}`, color: textColor, padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 13, transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#FFD700'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = darkMode ? '#333' : '#ddd'}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isActive && (
            <div ref={chatBoxRef} style={{ flex: 1, padding: '30px 10%', overflowY: 'auto', display: 'flex', flexDirection: 'column', background: darkMode ? '#181a20' : '#fafafa' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ maxWidth: '80%', marginBottom: 20, alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    padding: '12px 18px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user' ? COLORS.accentGold : (darkMode ? '#23262d' : '#fff'),
                    color: msg.role === 'user' ? COLORS.primaryDark : textColor,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: msg.role === 'bot' ? (darkMode ? '1px solid #333' : '1px solid #eee') : 'none',
                    lineHeight: 1.65, fontSize: 15,
                  }}>
                    {msg.role === 'bot' && <span style={{ marginRight: 6 }}>⚖️</span>}
                    {msg.text}
                  </div>
                  {msg.time && <div style={{ fontSize: 11, color: '#999', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.time}</div>}
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', background: darkMode ? '#23262d' : '#fff', border: '1px solid #eee', padding: '12px 18px', borderRadius: '18px 18px 18px 4px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <span style={{ color: '#999', fontSize: 22, letterSpacing: 4, animation: 'dots 1.4s infinite' }}>•••</span>
                  <style>{`@keyframes dots { 0%,80%,100%{opacity:0} 40%{opacity:1} }`}</style>
                </div>
              )}
            </div>
          )}

          {/* Input Box */}
          <div style={{ padding: '15px 10%', background: darkMode ? '#0f1115' : '#fff', borderTop: '1px solid #eee' }}>
            <div style={{
              background: darkMode ? '#1e2129' : '#fff', border: `1.5px solid ${darkMode ? '#333' : '#e0e0e0'}`,
              borderRadius: 30, padding: '10px 15px', display: 'flex', alignItems: 'center', gap: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 18 }}>+</button>
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Message InCrime Legal AI..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, padding: '5px 0', resize: 'none', maxHeight: 120, color: textColor, background: 'transparent' }}
              />
              <button onClick={handleVoice} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isListening ? '#ff4b4b' : '#999' }}>
                🎤
              </button>
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isTyping}
                style={{
                  background: inputText.trim() && !isTyping ? COLORS.primaryDark : '#f0f0f0',
                  color: inputText.trim() && !isTyping ? '#fff' : '#aaa',
                  width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', cursor: inputText.trim() && !isTyping ? 'pointer' : 'not-allowed', fontSize: 16,
                  transition: 'all 0.2s',
                }}
              >↑</button>
            </div>
            <p style={{ textAlign: 'center', fontSize: 11, color: '#bbb', margin: '8px 0 0' }}>
              InCrime provides general legal information, not professional legal advice. Consult a licensed advocate for your specific case.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
