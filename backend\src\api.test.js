import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.JWT_SECRET = 'test-secret-for-khanu';
process.env.LOCAL_AI_URL = 'http://127.0.0.1:1';
const { default: app } = await import('./app.js');

let token;
let bookingId;

before(async () => {
  const email = `learner-${Date.now()}@example.test`;
  const result = await request(app).post('/api/auth/register').send({ name: 'Jamie Learner', email, password: 'good-password-123' });
  assert.equal(result.status, 201);
  token = result.body.token;
});

test('services are public and the AI tutor match responds with match reasons', async () => {
  const catalog = await request(app).get('/api/services');
  assert.equal(catalog.status, 200);
  assert.ok(catalog.body.services.length >= 5);
  const match = await request(app).post('/api/ai/recommend').send({ goal: 'equations and algebra homework', subject: 'algebra', level: 'Middle school', budget: 50 });
  assert.equal(match.status, 200);
  assert.equal(match.body.matches[0].service.slug, 'algebra-foundations');
  assert.ok(match.body.matches[0].reasons.length > 0);
});

test('a learner can book, view, and cancel their own future session', async () => {
  const startsAt = new Date(Date.now() + 3 * 86400000).toISOString();
  const created = await request(app).post('/api/bookings').set('authorization', `Bearer ${token}`).send({ serviceSlug: 'algebra-foundations', startsAt, notes: 'Practice solving equations' });
  assert.equal(created.status, 201);
  bookingId = created.body.booking._id;
  const listed = await request(app).get('/api/bookings').set('authorization', `Bearer ${token}`);
  assert.equal(listed.status, 200);
  assert.ok(listed.body.bookings.some((booking) => booking._id === bookingId));
  const canceled = await request(app).patch(`/api/bookings/${bookingId}/cancel`).set('authorization', `Bearer ${token}`);
  assert.equal(canceled.status, 200);
  assert.equal(canceled.body.booking.status, 'cancelled');
});

test('booking routes require a valid session', async () => {
  const result = await request(app).get('/api/bookings');
  assert.equal(result.status, 401);
});
