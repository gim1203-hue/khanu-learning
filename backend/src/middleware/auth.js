import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import { User } from '../models/User.js';
import { demoStore, useDatabase } from '../data.js';

// Memory-mode development gets a fresh process-only key. Production startup
// requires JWT_SECRET, so a known fallback can never be used for deployment.
const runtimeSecret = randomBytes(32).toString('base64url');
const signingSecret = () => process.env.JWT_SECRET || runtimeSecret;

export function signToken(user) {
  return jwt.sign({ sub: String(user._id), name: user.name, email: user.email }, signingSecret(), { expiresIn: '7d' });
}

export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Sign in to continue.' });
  try {
    const payload = jwt.verify(token, signingSecret());
    const user = useDatabase() ? await User.findById(payload.sub) : demoStore.users.find((item) => String(item._id) === payload.sub);
    if (!user) return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  }
}
