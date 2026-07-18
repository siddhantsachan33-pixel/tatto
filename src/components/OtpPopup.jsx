import React, { useState } from 'react';

const API_BASE = (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ? 'https://tatto-backend-4axz.onrender.com/api'
  : 'http://localhost:5000/api';

export default function OtpPopup({ onClose, onLogin }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mockOtp, setMockOtp] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setMockOtp(data.otp);
        setStep('otp');
      } else {
        setError(data.message || 'Failed to send. Please try again.');
      }
    } catch {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOtp(code);
      setStep('otp');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('seedink_user_token', data.token);
        localStorage.setItem('seedink_user_data', JSON.stringify(data.user));
        onLogin && onLogin(data.user);
        onClose && onClose();
      } else {
        if (otp === mockOtp) {
          const userData = { email, name: '' };
          localStorage.setItem('seedink_user_data', JSON.stringify(userData));
          onLogin && onLogin(userData);
          onClose && onClose();
        } else {
          setError(data.message || 'Invalid code. Please try again.');
        }
      }
    } catch {
      if (otp === mockOtp) {
        const userData = { email, name: '' };
        localStorage.setItem('seedink_user_data', JSON.stringify(userData));
        onLogin && onLogin(userData);
        onClose && onClose();
      } else {
        setError('Invalid code. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="otp-overlay">
      <div className="otp-modal">
        {/* Left Panel */}
        <div className="otp-left">
          <div className="otp-brand">SEEDINK</div>
          <div className="otp-symbol">🕉️</div>
          <h2 className="otp-headline">Login now to<br />avail best offers!</h2>
          <p className="otp-subtext">Get exclusive 10% off your first order<br />and early access to new spiritual drops.</p>
          <div className="otp-features">
            <span>✓ Free shipping on orders ₹499+</span>
            <span>✓ Track your orders live</span>
            <span>✓ Members-only discounts</span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="otp-right">
          <button className="otp-close" onClick={onClose} aria-label="Close">✕</button>

          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="otp-form">
              <h3 className="otp-form-title">Enter your Email</h3>
              <p className="otp-form-sub">We'll send you a verification code</p>
              <div className="otp-input-group">
                <span className="otp-input-icon">✉️</span>
                <input
                  type="email"
                  className="otp-input"
                  placeholder="yourname@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              {error && <p className="otp-error">{error}</p>}
              <button type="submit" className="otp-submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
              <p className="otp-terms">
                By continuing, I accept the <a href="#faq">Privacy Policy</a> and <a href="#faq">T&Cs</a>.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="otp-form">
              <h3 className="otp-form-title">Verify your Email</h3>
              <p className="otp-form-sub">Code sent to <strong>{email}</strong></p>
              {mockOtp && (
                <div className="otp-demo-box">
                  🔐 Demo Code: <strong>{mockOtp}</strong>
                </div>
              )}
              <input
                type="text"
                className="otp-input otp-code-input"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                autoFocus
              />
              {error && <p className="otp-error">{error}</p>}
              <button type="submit" className="otp-submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
              <button type="button" className="otp-back" onClick={() => { setStep('email'); setError(''); setOtp(''); }}>
                ← Change email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
