import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { authApi } from '../../api';
import './Auth.css';

export default function Auth() {
  const { setUser, navigate, toast } = useApp();

  const [tab,     setTab]     = useState('login');  // 'login' | 'signup'
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Login fields — auth.php login action requires: email, password
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});

  // Signup fields — auth.php signup action requires: name, email, password; optional: phone
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [signupErrors, setSignupErrors] = useState({});

  const setLogin  = (k, v) => { setLoginForm(f  => ({ ...f, [k]: v })); setLoginErrors(e  => ({ ...e, [k]: '' })); };
  const setSignup = (k, v) => { setSignupForm(f => ({ ...f, [k]: v })); setSignupErrors(e => ({ ...e, [k]: '' })); };

  const switchTab = (t) => { setTab(t); setApiError(''); setLoginErrors({}); setSignupErrors({}); };

  // ── LOGIN ────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    const errs = {};
    if (!loginForm.email.trim())    errs.email    = 'Email is required';
    if (!loginForm.password.trim()) errs.password = 'Password is required';
    if (Object.keys(errs).length)   { setLoginErrors(errs); return; }

    setLoading(true); setApiError('');
    try {
      const res = await authApi.login(loginForm);
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data);
        toast(`Welcome back, ${res.data.name}!`);
        navigate('home');
      } else {
        setApiError(res.message || 'Invalid credentials');
      }
    } catch {
      setApiError('Server unreachable. Please try again.');
    }
    setLoading(false);
  };

  // ── SIGNUP ───────────────────────────────────────────────────────────
  const handleSignup = async () => {
    const errs = {};
    if (!signupForm.name.trim())     errs.name     = 'Name is required';
    if (!signupForm.email.trim())    errs.email    = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(signupForm.email)) errs.email = 'Enter a valid email';
    if (!signupForm.password.trim()) errs.password = 'Password is required';
    if (signupForm.password.length < 6) errs.password = 'Min 6 characters';
    if (Object.keys(errs).length)    { setSignupErrors(errs); return; }

    setLoading(true); setApiError('');
    try {
      const res = await authApi.signup(signupForm);
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data);
        toast(`Welcome, ${res.data.name}!`);
        navigate('home');
      } else {
        setApiError(res.message || 'Signup failed');
      }
    } catch {
      setApiError('Server unreachable. Please try again.');
    }
    setLoading(false);
  };

  const onKeyDown = (e, fn) => { if (e.key === 'Enter') fn(); };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <p className="auth-logo">Lumière<em>·</em>Beauty</p>

        {/* Tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab${tab === 'login'  ? ' active' : ''}`} onClick={() => switchTab('login')}>Sign In</button>
          <button className={`auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => switchTab('signup')}>Create Account</button>
        </div>

        {/* API-level error */}
        {apiError && <div className="auth-error">{apiError}</div>}

        {/* ── LOGIN FORM ── */}
        {tab === 'login' && (
          <div className="auth-form">
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                className={`form-input${loginErrors.email ? ' error' : ''}`}
                type="email"
                value={loginForm.email}
                onChange={e => setLogin('email', e.target.value)}
                onKeyDown={e => onKeyDown(e, handleLogin)}
                placeholder="your@email.com"
                autoComplete="email"
              />
              {loginErrors.email && <p className="auth-field-error">{loginErrors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                className={`form-input${loginErrors.password ? ' error' : ''}`}
                type="password"
                value={loginForm.password}
                onChange={e => setLogin('password', e.target.value)}
                onKeyDown={e => onKeyDown(e, handleLogin)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {loginErrors.password && <p className="auth-field-error">{loginErrors.password}</p>}
            </div>

            <button
              className="btn btn-dark btn-full auth-submit"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <p className="auth-switch">
              Don't have an account?{' '}
              <span className="auth-switch-link" onClick={() => switchTab('signup')}>Create one</span>
            </p>
          </div>
        )}

        {/* ── SIGNUP FORM ── */}
        {tab === 'signup' && (
          <div className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                className={`form-input${signupErrors.name ? ' error' : ''}`}
                type="text"
                value={signupForm.name}
                onChange={e => setSignup('name', e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
              />
              {signupErrors.name && <p className="auth-field-error">{signupErrors.name}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                className={`form-input${signupErrors.email ? ' error' : ''}`}
                type="email"
                value={signupForm.email}
                onChange={e => setSignup('email', e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
              />
              {signupErrors.email && <p className="auth-field-error">{signupErrors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                className={`form-input${signupErrors.password ? ' error' : ''}`}
                type="password"
                value={signupForm.password}
                onChange={e => setSignup('password', e.target.value)}
                onKeyDown={e => onKeyDown(e, handleSignup)}
                placeholder="Min 6 characters"
                autoComplete="new-password"
              />
              {signupErrors.password && <p className="auth-field-error">{signupErrors.password}</p>}
            </div>

            {/* Phone is optional in auth.php */}
            <div className="form-group">
              <label className="form-label">Phone <span className="optional">(optional)</span></label>
              <input
                className="form-input"
                type="tel"
                value={signupForm.phone}
                onChange={e => setSignup('phone', e.target.value)}
                placeholder="10-digit number"
                autoComplete="tel"
              />
            </div>

            <button
              className="btn btn-dark btn-full auth-submit"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>

            <p className="auth-switch">
              Already have an account?{' '}
              <span className="auth-switch-link" onClick={() => switchTab('login')}>Sign in</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
