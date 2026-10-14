const STOP_WORDS = new Set(['about', 'after', 'also', 'and', 'are', 'because', 'build', 'can', 'class', 'course', 'help', 'improve', 'learn', 'lesson', 'need', 'session', 'some', 'that', 'the', 'their', 'this', 'want', 'with', 'would', 'you', 'your']);
const tokenize = (value = '') => String(value).toLowerCase().match(/[a-z0-9+]+/g)?.filter((word) => word.length > 1 && !STOP_WORDS.has(word)) || [];

export function scoreRecommendations(services, { goal = '', subject = '', level = '', budget = '' } = {}) {
  const query = tokenize(`${goal} ${subject} ${level}`);
  const budgetValue = Number(budget);
  return services.map((service) => {
    const titleWords = tokenize(service.title);
    const contextWords = tokenize(`${service.category} ${service.description} ${service.level} ${(service.tags || []).join(' ')}`);
    const titleHits = query.filter((word) => titleWords.includes(word)).length;
    const contextHits = query.filter((word) => contextWords.includes(word)).length;
    const levelMatch = level && service.level.toLowerCase().includes(String(level).toLowerCase()) ? 2 : 0;
    const budgetMatch = budgetValue > 0 && service.price <= budgetValue ? 1 : 0;
    const score = titleHits * 4 + contextHits + levelMatch + budgetMatch + (service.rating || 0) / 10;
    const reasons = [];
    if (titleHits || contextHits) reasons.push(`Matches your ${subject || 'learning'} goals`);
    if (levelMatch) reasons.push(`A fit for ${level}`);
    if (budgetMatch) reasons.push(`Within your $${budgetValue} budget`);
    if (!reasons.length) reasons.push(`${service.category} with a ${service.rating} learner rating`);
    return { service, score, reasons };
  }).sort((a, b) => b.score - a.score || b.service.rating - a.service.rating).slice(0, 3);
}

export async function tutorMatch(services, preferences, localAiUrl = process.env.LOCAL_AI_URL || 'http://127.0.0.1:11435') {
  const matches = scoreRecommendations(services, preferences);
  let reply = `I’d start with ${matches[0]?.service.title || 'a focused learning session'}. Tell me your subject, goal, level, or budget and I’ll narrow it down.`;
  let poweredBy = 'Khanu smart matching';
  try {
    const baseUrl = localAiUrl.replace(/\/$/, '');
    const status = await fetch(`${baseUrl}/v1/models`, { signal: AbortSignal.timeout(1200) });
    const model = status.ok ? (await status.json()).data?.[0]?.id : null;
    if (model) {
      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, signal: AbortSignal.timeout(10000),
        body: JSON.stringify({ model, stream: false, temperature: 0.45, max_tokens: 140, messages: [
          { role: 'system', content: 'You are Khanu, a kind and concise tutoring advisor. Recommend from the provided options only. Explain the top match in two short sentences. Never claim to book a session.' },
          { role: 'user', content: JSON.stringify({ learning_goal: preferences, options: matches.map(({ service, reasons }) => ({ title: service.title, tutor: service.tutor, price: service.price, level: service.level, reasons })) }) },
        ] }),
      });
      const data = response.ok ? await response.json() : null;
      const generated = data?.choices?.[0]?.message?.content?.trim();
      if (generated) { reply = generated; poweredBy = 'Khanu local AI + smart matching'; }
    }
  } catch { /* Matching remains available if the optional local language model is offline. */ }
  return { reply, matches, poweredBy };
}
