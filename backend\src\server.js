import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDatabase } from './config/database.js';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, '../../.env') });
if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || /^(replace|change-me|local-development)/i.test(process.env.JWT_SECRET))) {
  throw new Error('Production requires a unique, randomly generated JWT_SECRET with at least 32 characters.');
}
const { default: app } = await import('./app.js');
const port = Number(process.execArgv.includes('--watch') ? (process.env.DEV_PORT || 5000) : (process.env.PORT || 4173));
const host = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');
await connectDatabase();
app.listen(port, host, () => console.log(`Khanu is ready at http://${host}:${port}`));
