import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { User } from '../models/User.js';
import { demoStore, useDatabase } from '../data.js';
import { findUserByEmail } from '../services/catalog.js';
import { signToken } from '../middleware/auth.js';

const credentials = z.object({ email: z.string().email().max(160).transform((value) => value.toLowerCase().trim()), password: z.string().min(8).max(128) });
const registration = credentials.extend({ name: z.string().trim().min(2).max(80) });
const publicUser = (user) => ({ id: String(user._id), name: user.name, email: user.email });

export async function register(req, res) {
  const parsed = registration.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Please check your details.' });
  const { name, email, password } = parsed.data;
  if (await findUserByEmail(email)) return res.status(409).json({ error: 'An account with that email already exists.' });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = useDatabase() ? await User.create({ name, email, passwordHash }) : { _id: randomUUID(), name, email, passwordHash };
  if (!useDatabase()) demoStore.users.push(user);
  res.status(201).json({ token: signToken(user), user: publicUser(user), demo: !useDatabase() });
}

export async function login(req, res) {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Enter a valid email and password.' });
  const user = await findUserByEmail(parsed.data.email);
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return res.status(401).json({ error: 'Email or password is incorrect.' });
  res.json({ token: signToken(user), user: publicUser(user), demo: !useDatabase() });
}

export function me(req, res) { res.json({ user: publicUser(req.user), demo: !useDatabase() }); }
