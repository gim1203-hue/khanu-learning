import { z } from 'zod';
import { listServices } from '../services/catalog.js';
import { tutorMatch } from '../services/recommendation.js';

const preferenceSchema = z.object({ goal: z.string().max(600).optional().default(''), subject: z.string().max(80).optional().default(''), level: z.string().max(80).optional().default(''), budget: z.coerce.number().min(0).max(1000).optional().default(0) });
export async function recommend(req, res) {
  const parsed = preferenceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Tell me a bit about your learning goal.' });
  const result = await tutorMatch(await listServices(), parsed.data);
  res.json(result);
}
