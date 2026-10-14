import { catalog, demoStore, useDatabase } from '../data.js';
import { Service } from '../models/Service.js';

export async function listServices() {
  if (!useDatabase()) return catalog;
  const saved = await Service.find().sort({ title: 1 }).lean();
  return saved.length ? saved : catalog;
}

export async function getService(slug) {
  if (!useDatabase()) return catalog.find((item) => item.slug === slug) || null;
  return Service.findOne({ slug }).lean();
}

export async function findUserByEmail(email) {
  if (!useDatabase()) return demoStore.users.find((u) => u.email === email) || null;
  return (await (await import('../models/User.js')).User.findOne({ email })) || null;
}
