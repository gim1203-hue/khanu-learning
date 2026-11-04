import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog } from '../data.js';
import { scoreRecommendations, tutorMatch, sanitizedProviderMessage, requestWithRetry } from './recommendation.js';

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

const prefs = { goal: 'Help with equations', subject: 'algebra', level: 'Middle school', budget: 50 };
const config = { baseUrl: 'https://ai.example.test/v1', model: 'test-model', apiKey: 'test-secret', hosted: true };
test('hosted model explains ranked choices and keeps credentials private', async () => {
  const result = await tutorMatch(catalog, prefs, config, async (url, options) => {
    assert.equal(url, config.baseUrl + '/chat/completions');
    assert.equal(options.headers.authorization, 'Bearer test-secret');
    const body = JSON.parse(options.body);
    assert.equal(body.model, config.model);
    assert.equal(body.max_completion_tokens, 240);
    assert.equal(JSON.parse(body.messages[1].content).ranked_options[0].title, 'Algebra Foundations');
    assert.equal(options.body.includes(config.apiKey), false);
    return { ok: true, json: async () => ({ choices: [{ message: { content: 'Algebra Foundations fits your level and budget.' } }] }) };
  });
  assert.equal(result.ai.status, 'generated');
  assert.equal(result.matches[0].service.slug, 'algebra-foundations');
  assert.equal(JSON.stringify(result).includes(config.apiKey), false);
});
test('provider failure, quota limits, and invalid output use explicit fallback', async () => {
  for (const fetchImpl of [
    async () => { throw new Error('private provider error'); },
    async () => ({ ok: false, status: 429 }),
    async () => ({ ok: false, status: 401 }),
    async () => ({ ok: true, json: async () => ({ choices: [] }) }),
    async () => ({ ok: true, json: async () => ({ choices: [{ message: { content: ' ' } }] }) }),
    async () => ({ ok: true, json: async () => { throw new Error('bad JSON'); } }),
  ]) {
    const result = await tutorMatch(catalog, prefs, config, fetchImpl);
    assert.equal(result.ai.status, 'fallback');
    assert.equal(result.matches[0].service.slug, 'algebra-foundations');
    assert.equal(JSON.stringify(result).includes('private provider error'), false);
  }
});
test('incomplete or insecure hosted configuration makes no request', async () => {
  for (const settings of [{ ...config, apiKey: '' }, { ...config, model: '' }, { ...config, baseUrl: 'http://ai.example.test/v1' }]) {
    const result = await tutorMatch(catalog, prefs, settings, () => assert.fail('unexpected request'));
    assert.equal(result.ai.status, 'fallback');
  }
});
test('local model discovery remains available', async () => {
  const result = await tutorMatch(catalog, prefs, 'http://127.0.0.1:11435', async (url, options) => {
    if (url.endsWith('/models')) return { ok: true, json: async () => ({ data: [{ id: 'local-model' }] }) };
    assert.equal(JSON.parse(options.body).max_tokens, 240);
    return { ok: true, json: async () => ({ choices: [{ message: { content: 'Start with Algebra Foundations.' } }] }) };
  });
  assert.equal(result.ai.status, 'generated');
  assert.equal(result.poweredBy, 'Khanu local AI + smart matching');
});

test('Gemini native interactions excludes thoughts and keeps the key server-side', async () => {
  const result = await tutorMatch(catalog, prefs, { ...config, baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-3.8-flash' }, async (url, options) => {
    assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/interactions');
    assert.equal(options.headers['x-goog-api-key'], config.apiKey);
    const body = JSON.parse(options.body);
    assert.equal(body.generation_config.thinking_level, 'low');
    assert.equal(body.generation_config.max_output_tokens, 4096);
    assert.equal(body.store, false);
    assert.equal(body.model, 'gemini-3.8-flash');
    assert.equal(JSON.parse(body.input).ranked_options[0].title, 'Algebra Foundations');
    return { ok: true, json: async () => ({ status: 'completed', steps: [
      { type: 'thought', content: [{ type: 'text', text: 'INTERNAL REASONING' }] },
      { type: 'model_output', content: [{ type: 'text', text: 'Algebra Foundations fits your goal.' }] },
    ] }) };
  });
  assert.equal(result.ai.status, 'generated');
  assert.equal(result.reply, 'Algebra Foundations fits your goal.');
});

test('provider diagnostics expose only a safe category and status', async () => {
  for (const [status, reason] of [[400, 'invalid_provider_request'], [401, 'authentication_or_permissions'], [403, 'authentication_or_permissions'], [404, 'model_or_endpoint_not_found'], [429, 'quota_or_rate_limit'], [503, 'provider_unavailable']]) {
    const result = await tutorMatch(catalog, prefs, config, async () => ({ ok: false, status, json: async () => ({ error: { message: 'secret-key-and-private-input' } }) }));
    assert.equal(result.ai.reason, reason);
    assert.equal(result.ai.providerStatus, status);
    assert.equal(JSON.stringify(result).includes('secret-key-and-private-input'), false);
  }
});

test('server diagnostics redact keys and learner input and limit log size', () => {
  const output = sanitizedProviderMessage('secret-key learner goal AIzaExampleKey123\nUnavailable', 'secret-key', { goal: 'learner goal' });
  assert.equal(output.includes('secret-key'), false);
  assert.equal(output.includes('learner goal'), false);
  assert.equal(output.includes('AIza'), false);
  assert.equal(output.includes('\n'), false);
  assert.ok(sanitizedProviderMessage('x'.repeat(1000), '').length <= 600);
});

test('transient outage retries once and recovers; client failures are not retried', async () => {
  let calls = 0;
  const response = await requestWithRetry('https://example.test', {}, async () => ({ status: ++calls === 1 ? 503 : 200 }), async () => {});
  assert.equal(response.status, 200);
  assert.equal(calls, 2);
  calls = 0;
  await requestWithRetry('https://example.test', {}, async () => { calls++; return { status: 503 }; }, async () => {});
  assert.equal(calls, 2);
  for (const status of [400, 401, 403, 404, 429]) {
    calls = 0;
    await requestWithRetry('https://example.test', {}, async () => { calls++; return { status }; }, async () => {});
    assert.equal(calls, 1);
  }
});

test('an empty budget and level are sent to the model as unspecified', async () => {
  await tutorMatch(catalog, { goal: 'Algebra', budget: '', level: '' }, config, async (url, options) => {
    const input = JSON.parse(JSON.parse(options.body).messages[1].content);
    assert.equal(input.learner_preferences.budget, null);
    assert.equal(input.learner_preferences.level, null);
    return { ok: true, json: async () => ({ choices: [{ message: { content: 'Algebra Foundations matches your goal.' } }] }) };
  });
});
