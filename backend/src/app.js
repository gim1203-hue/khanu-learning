import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import api from './routes/api.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const buildPath = path.resolve(here, '../../frontend/dist');
const app = express();
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((v) => v.trim()) : true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', api);
app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found.' }));
app.use(express.static(buildPath, { maxAge: '1h', index: false }));
app.get('*splat', (_req, res, next) => res.sendFile(path.join(buildPath, 'index.html'), (error) => error && next()));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ error: error.status ? error.message : 'Something went wrong. Please try again.' });
});
export default app;
