import { listServices } from '../services/catalog.js';
export async function getServices(req, res) {
  const services = await listServices();
  const category = String(req.query.category || '').toLowerCase();
  const query = String(req.query.q || '').toLowerCase().trim();
  const filtered = services.filter((s) => (!category || s.category.toLowerCase() === category) && (!query || `${s.title} ${s.description} ${s.tags.join(' ')}`.toLowerCase().includes(query)));
  res.json({ services: filtered, categories: [...new Set(services.map((s) => s.category))] });
}
