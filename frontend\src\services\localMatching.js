import { demoServices } from './demoCatalog.js';

const STOP_WORDS = new Set(['about', 'after', 'also', 'and', 'are', 'because', 'build', 'can', 'class', 'course', 'help', 'improve', 'learn', 'lesson', 'need', 'session', 'some', 'that', 'the', 'their', 'this', 'want', 'with', 'would', 'you', 'your']);
const tokenize = (value = '') => String(value).toLowerCase().match(/[a-z0-9+]+/g)?.filter((word) => word.length > 1 && !STOP_WORDS.has(word)) || [];

export function scoreLocalRecommendations(services, { goal = '', subject = '', level = '', budget = '' } = {}) {
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

export function localRecommendation(preferences) {
  const matches = scoreLocalRecommendations(demoServices, preferences);
  return {
    matches,
    reply: `I’d start with ${matches[0]?.service.title || 'a focused learning session'}. Tell me your subject, goal, level, or budget and I’ll narrow it down.`,
    poweredBy: 'Khanu browser-local smart matching',
  };
}
