import test from 'node:test';
import assert from 'node:assert/strict';
import { localApi } from './localDemoApi.js';

test('GitHub Pages demo matches locally and saves/cancels browser-only bookings', async () => {
  const values = new Map();
  const previous = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
  try {
    const catalog = await localApi('/services');
    assert.equal(catalog.services.length, 6);
    const recommendation = await localApi('/ai/recommend', { method: 'POST', body: JSON.stringify({ goal: 'balance chemistry equations', subject: 'chemistry', level: 'High school', budget: 50 }) });
    assert.equal(recommendation.matches[0].service.slug, 'chemistry-lab');
    assert.equal(recommendation.poweredBy, 'Khanu browser-local smart matching');
    const account = await localApi('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Test Learner' }) });
    const startsAt = new Date(Date.now() + 86400000).toISOString();
    const created = await localApi('/bookings', { method: 'POST', body: JSON.stringify({ serviceSlug: 'chemistry-lab', startsAt, notes: 'Stoichiometry review' }) });
    assert.equal((await localApi('/bookings')).bookings.length, 1);
    const canceled = await localApi(`/bookings/${created.booking._id}/cancel`, { method: 'PATCH' });
    assert.equal(canceled.booking.status, 'cancelled');
    assert.equal((await localApi('/auth/me')).user.id, account.user.id);
    const profile = JSON.parse(values.get('khanu-browser-profile-v1'));
    assert.equal(Object.hasOwn(profile, 'password'), false);
  } finally {
    if (previous === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previous;
  }
});
