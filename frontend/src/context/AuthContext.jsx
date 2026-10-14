import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, STATIC_DEMO, TOKEN_KEY } from '../services/api.js';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));
  const [demo, setDemo] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    api('/auth/me').then((data) => { setUser(data.user); setDemo(data.demo); }).catch(() => localStorage.removeItem(TOKEN_KEY)).finally(() => setChecking(false));
  }, []);
  const signIn = useCallback(async (endpoint, payload) => {
    if (STATIC_DEMO) endpoint = 'register';
    const data = await api(`/auth/${endpoint}`, { method: 'POST', body: JSON.stringify(payload) });
    localStorage.setItem(TOKEN_KEY, data.token); setUser(data.user); setDemo(data.demo); return data;
  }, []);
  const signOut = useCallback(() => { localStorage.removeItem(TOKEN_KEY); setUser(null); setDemo(false); }, []);
  const value = useMemo(() => ({ user, demo, checking, signIn, signOut }), [user, demo, checking, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
