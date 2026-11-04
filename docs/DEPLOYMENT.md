# Deployment

## Project links

- Main application: https://khanu-learning.onrender.com/
- GitHub Pages frontend: https://gim1203-hue.github.io/khanu-learning/
- Source repository: https://github.com/gim1203-hue/khanu-learning
- API health: https://khanu-learning.onrender.com/api/health
- Service catalog: https://khanu-learning.onrender.com/api/services

## Current hosting

Render serves React and Express together with MongoDB connected. Gemini explanations have succeeded live but remain intermittent. GitHub Actions publishes an additional Pages frontend. The source branch is main.

Render build command: npm ci && npm run build. Start command: npm start. Use Node.js 20 or newer and the host-supplied PORT. Production Express binds to 0.0.0.0.

## Environment settings

| Variable | Purpose or public value |
|---|---|
| NODE_ENV | production |
| CLIENT_URL | https://gim1203-hue.github.io |
| MONGODB_URI | Private MongoDB URI |
| JWT_SECRET | Private random secret of at least 32 characters |
| AI_BASE_URL | https://generativelanguage.googleapis.com/v1beta/openai |
| AI_MODEL | gemini-3.5-flash-lite |
| AI_API_KEY | Private Google AI Studio key |

Google's hostname selects native /v1beta/interactions, even with the compatible-looking base URL above. LOCAL_AI_URL is optional for a model reachable from the backend host; Render cannot reach a laptop through localhost.

## GitHub Pages

Repository Settings > Pages uses GitHub Actions. The workflow uses the public Render origin as the default VITE_API_BASE_URL; a repository variable can override it. Its base path is /khanu-learning/. Builds without any API origin support an explicitly labeled browser demo. Publishing Pages does not itself update Render.

## Release checks

Run npm test, npm run build, and npm run build:pages. Commit no credentials or generated bundles. Push main and check the latest Live Render commit and Pages workflow. Check health, catalog, account/booking flows, ownership, actual generated AI output, mobile layout, and controlled database persistence across a restart.

Do not repeatedly redeploy for provider overload. Inspect sanitized provider logs. A Google 503 or timeout leads to fallback. Render's free service may sleep. Roll back application regressions using the previous deployment if needed.
