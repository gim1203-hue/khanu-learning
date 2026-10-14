import { useState } from 'react';
import { X } from 'lucide-react';
import { STATIC_DEMO } from '../services/api.js';

export default function AuthModal({ onClose, onSubmit }) {
  const [mode, setMode] = useState('login'); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('');
    const form = new FormData(event.currentTarget);
    const payload = STATIC_DEMO ? { name: form.get('name') } : { email: form.get('email'), password: form.get('password') };
    if (!STATIC_DEMO && mode === 'register') payload.name = form.get('name');
    try { await onSubmit(STATIC_DEMO ? 'register' : mode === 'register' ? 'register' : 'login', payload); onClose(); } catch (issue) { setError(issue.message); } finally { setBusy(false); }
  };
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="modal auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button className="modal-close" onClick={onClose} aria-label="Close"><X /></button><div className="modal-mark">✳</div><span className="eyebrow">WELCOME TO KHANU</span><h2 id="auth-title">{STATIC_DEMO ? 'Start a browser demo' : mode === 'register' ? 'Create your account' : 'Good to see you again'}</h2><p>{STATIC_DEMO ? 'Use a display name only. Your demo profile and bookings stay in this browser; no password or email is collected.' : 'Save your learning plan and keep track of upcoming sessions.'}</p>
    <form onSubmit={submit}>{(STATIC_DEMO || mode === 'register') && <label>Your name<input name="name" autoComplete="name" minLength="2" maxLength="80" required placeholder="Jamie Smith" /></label>}{!STATIC_DEMO && <><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>Password<input name="password" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength="8" required placeholder="At least 8 characters" /></label></>}{error && <p className="form-error" role="alert">{error}</p>}<button className="button primary full" disabled={busy}>{busy ? 'One moment…' : STATIC_DEMO ? 'Start browser demo' : mode === 'register' ? 'Create account' : 'Sign in'}</button></form>
    {!STATIC_DEMO && <p className="auth-toggle">{mode === 'register' ? 'Already have an account?' : 'New to Khanu?'} <button onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }}>{mode === 'register' ? 'Sign in' : 'Create account'}</button></p>}</section></div>;
}
