import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog } from '../data.js';
import { scoreRecommendations } from './recommendation.js';

test('recommendation ranks the requested subject and respects budget', () => {
  const result = scoreRecommendations(catalog, { goal: 'I need help solving equations', subject: 'algebra', level: 'Middle school', budget: 50 });
  assert.equal(result[0].service.slug, 'algebra-foundations');
  assert.ok(result[0].reasons.some((reason) => reason.includes('budget')));
});

test('recommendation always returns up to three useful options for a broad request', () => {
  const result = scoreRecommendations(catalog, { goal: 'I want to learn something new' });
  assert.equal(result.length, 3);
  assert.ok(result.every(({ reasons }) => reasons.length));
});
