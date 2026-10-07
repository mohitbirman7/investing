import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function AuthModal({ isOpen, initialView, onClose }) {
  const [view, setView] = useState(initialView || 'login');
  const [formData, setFormData] = useState({ name: '', id: '', pw: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const nextOtp = [...otp];
    nextOtp[idx] = val.slice(-1);
    setOtp(nextOtp);
    if (val && idx < 5) {
      const nextSibling = document.getElementById(`otp-${idx + 1}`);
      if (nextSibling) nextSibling.focus();
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('');
    try {
      // API call to backend route
      const res = await fetch('/api/auth/precheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: view, ...formData })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setView('otp');
    } catch (err) {
      setStatusMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setStatusMsg('Enter 6-digit code');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: view, id: formData.id, code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setView('done');
    } catch (err) {
      setStatusMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ov" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="x" onClick={onClose} style={{ position: 'absolute', right: 16, top: 16, background: 'none', border: 0, color: 'var(--mu)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {view === 'login' && (
          <div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28 }}>Welcome Back</h3>
            <p style={{ color: 'var(--mu)', fontSize: 13, marginBottom: 20 }}>Log in to mohitcampney terminal</p>
            <form onSubmit={handleAuthSubmit}>
              <input name="id" placeholder="Email or Mobile" required onChange={handleInputChange} />
              <input name="pw" type="password" placeholder="Password" required onChange={handleInputChange} />
              {statusMsg && <p style={{ color: 'var(--dn)', fontSize: 12 }}>{statusMsg}</p>}
              <button className="btn pri" style={{ width: '100%', marginTop: 15 }} disabled={loading}>
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </form>
            <p style={{ fontSize: 13, color: 'var(--mu)', marginTop: 15, textAlign: 'center' }}>
              Don't have an account? <span style={{ color: 'var(--ac)', cursor: 'pointer' }} onClick={() => setView('signup')}>Register</span>
            </p>
          </div>
        )}

        {view === 'signup' && (
          <div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28 }}>Get Started</h3>
            <p style={{ color: 'var(--mu)', fontSize: 13, marginBottom: 20 }}>Instant setup with institutional routing</p>
            <form onSubmit={handleAuthSubmit}>
              <input name="name" placeholder="Full Name" required onChange={handleInputChange} />
              <input name="id" placeholder="Email or Mobile" required onChange={handleInputChange} />
              <input name="pw" type="password" placeholder="Password (min 6 characters)" minLength={6} required onChange={handleInputChange} />
              {statusMsg && <p style={{ color: 'var(--dn)', fontSize: 12 }}>{statusMsg}</p>}
              <button className="btn pri" style={{ width: '100%', marginTop: 15 }} disabled={loading}>
                {loading ? 'Sending OTP...' : 'Create Account'}
              </button>
            </form>
            <p style={{ fontSize: 13, color: 'var(--mu)', marginTop: 15, textAlign: 'center' }}>
              Already registered? <span style={{ color: 'var(--ac)', cursor: 'pointer' }} onClick={() => setView('login')}>Log in</span>
            </p>
          </div>
        )}

        {view === 'otp' && (
          <div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 28 }}>Security Check</h3>
            <p style={{ color: 'var(--mu)', fontSize: 13, marginBottom: 20 }}>Enter verification code sent to your credentials</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 15 }}>
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={d}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  style={{ width: 42, height: 48, textAlign: 'center', border: '1px solid var(--line)', borderRadius: 8, fontSize: 18 }}
                  maxLength={1}
                />
              ))}
            </div>
            {statusMsg && <p style={{ color: 'var(--dn)', fontSize: 12 }}>{statusMsg}</p>}
            <button className="btn pri" style={{ width: '100%', marginTop: 10 }} onClick={handleOtpVerify} disabled={loading}>
              Verify Identity
            </button>
          </div>
        )}

        {view === 'done' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 56, height: 56, border: '1px solid var(--ac)', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 16px', color: 'var(--ac)' }}>
              <Check size={28} />
            </div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: 26 }}>Identity Confirmed</h3>
            <p style={{ color: 'var(--mu)', fontSize: 14, margin: '10px 0 20px' }}>Your mohitcampney trading workspace is ready.</p>
            <button className="btn pri" style={{ width: '100%' }} onClick={onClose}>Enter Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
}