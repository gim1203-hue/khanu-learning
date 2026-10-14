import { demoCategories, demoServices } from './demoCatalog.js';
import { localRecommendation } from './localMatching.js';

const PROFILE_KEY = 'khanu-browser-profile-v1';
const BOOKINGS_KEY = 'khanu-browser-bookings-v1';
const parse = (value, fallback) => { try { return JSON.parse(value) ?? fallback; } catch { return fallback; } };
const profile = () => parse(localStorage.getItem(PROFILE_KEY), null);
const saveProfile = (value) => localStorage.setItem(PROFILE_KEY, JSON.stringify(value));
const bookings = () => parse(localStorage.getItem(BOOKINGS_KEY), []);
const saveBookings = (value) => localStorage.setItem(BOOKINGS_KEY, JSON.stringify(value));
const makeId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const result = (data) => data;
const payloadOf = (options) => options.body ? JSON.parse(options.body) : {};

export async function localApi(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  if (path === '/health' && method === 'GET') return result({ ok: true, app: 'Khanu', database: 'browser-local', ai: 'on-device smart matcher' });
  if (path === '/services' && method === 'GET') return result({ services: demoServices, categories: demoCategories });
  if (path === '/ai/recommend' && method === 'POST') return result(localRecommendation(payloadOf(options)));
  if (path === '/auth/register' && method === 'POST') {
    const { name } = payloadOf(options);
    if (!name || String(name).trim().length < 2) throw new Error('Enter a name with at least two characters.');
    const user = { id: 'browser-learner', name: String(name).trim().slice(0, 80), email: 'Browser-only demo profile' };
    saveProfile(user);
    return result({ token: 'browser-demo', user, demo: true });
  }
  if (path === '/auth/me' && method === 'GET') {
    const user = profile();
    if (!user) throw new Error('Your browser demo profile was not found. Start a new demo profile.');
    return result({ user, demo: true });
  }
  if (path === '/bookings' && method === 'GET') {
    const user = profile();
    if (!user) throw new Error('Create a browser demo profile to view sessions.');
    return result({ bookings: bookings().filter((booking) => booking.user === user.id) });
  }
  if (path === '/bookings' && method === 'POST') {
    const user = profile();
    if (!user) throw new Error('Create a browser demo profile to book a session.');
    const input = payloadOf(options);
    const service = demoServices.find((item) => item.slug === input.serviceSlug);
    const startsAt = new Date(input.startsAt);
    if (!service) throw new Error('That tutoring session could not be found.');
    if (Number.isNaN(startsAt.getTime()) || startsAt <= new Date()) throw new Error('Choose a future appointment time.');
    const booking = { _id: makeId(), user: user.id, serviceSlug: service.slug, serviceTitle: service.title, tutor: service.tutor, startsAt: startsAt.toISOString(), notes: String(input.notes || '').slice(0, 500), status: 'upcoming', createdAt: new Date().toISOString() };
    saveBookings([...bookings(), booking]);
    return result({ booking });
  }
  const cancel = path.match(/^\/bookings\/([^/]+)\/cancel$/);
  if (cancel && method === 'PATCH') {
    const user = profile();
    if (!user) throw new Error('Create a browser demo profile to manage sessions.');
    let found;
    const updated = bookings().map((booking) => {
      if (booking._id !== cancel[1] || booking.user !== user.id) return booking;
      if (booking.status === 'cancelled') throw new Error('This booking is already cancelled.');
      found = { ...booking, status: 'cancelled' };
      return found;
    });
    if (!found) throw new Error('Booking not found.');
    saveBookings(updated);
    return result({ booking: found });
  }
  throw new Error(`This browser demo does not support ${method} ${path}.`);
}
