# Khanu Learning

Khanu Learning is an AI-assisted tutoring discovery and appointment-booking capstone. Learners browse six sample services, describe a learning goal, get ranked recommendations with an AI explanation, and manage their bookings.

## Project links

- Main application: https://khanu-learning.onrender.com/
- GitHub Pages frontend: https://gim1203-hue.github.io/khanu-learning/
- Source repository: https://github.com/gim1203-hue/khanu-learning
- API health: https://khanu-learning.onrender.com/api/health
- Service catalog: https://khanu-learning.onrender.com/api/services

## Technology and features

React 19 and Vite provide the presentation layer. Node.js and Express 5 handle REST APIs, validation, and authorization. MongoDB with Mongoose stores users, services, and bookings. Google Gemini generates explanations through native Interactions. Render serves the frontend and API together; GitHub Pages is an additional frontend.

- Catalog search, category filters, tutor details, durations, and prices.
- Registration, login/logout, bcrypt password hashing, JWT authentication, and protected actions.
- Future appointments, My Sessions dashboard, cancellation, and ownership checks.
- Goal/subject/level/budget ranking with Gemini explanations and visibly labeled fallback.
- Responsive layout, light/dark theme, and animated robot personalization.

## Run in VS Code

Open the Khanu-Learning-Complete repository folder and install Node.js 20 or newer.

```sh
npm ci
```

Copy .env.example to ignored .env. Set a strong JWT_SECRET and reachable MONGODB_URI. Hosted AI uses server-only AI_BASE_URL, AI_MODEL, and AI_API_KEY. Never commit private values.

```sh
npm run dev
```

This starts Vite at http://127.0.0.1:5173 and the development API on port 5000. Separate commands are npm run dev:web and npm run dev:api.

```sh
npm test
npm run build
npm start
```

Production-like local URL: http://127.0.0.1:4173. npm run build:pages builds the Pages frontend. Use npm scripts; this repository does not include Start Assistant.bat.

## Deployment and environment

The main Render application is deployed with MongoDB and Gemini. Current verified model: gemini-3.5-flash-lite. Provider keys belong in Render Environment. Pages uses VITE_API_BASE_URL=https://khanu-learning.onrender.com; only builds without an API URL use the browser-local demo.

Render needs NODE_ENV=production, MONGODB_URI, JWT_SECRET, and CLIENT_URL=https://gim1203-hue.github.io. It supplies PORT. VITE_* values are public browser configuration and must never contain secrets. See [deployment](docs/DEPLOYMENT.md) and [AI setup](docs/AI_SETUP.md).

## Verification and limits

As of November 4, 2026, live API checks passed registration, login, catalog filtering, protected access, booking/cancellation, and cross-account isolation. MongoDB connectivity is confirmed. User-provided screenshots demonstrate generated explanations and corrected blank-budget behavior. The automated suite has 15 passing tests.

AI remains intermittent: Google has returned high-demand 503 errors and timeouts. Requests are bounded and temporary server errors are retried once, then clearly labeled fallback keeps the catalog usable. Render's free instance may sleep. Controlled restart persistence, broader devices, and a full browser-driven account flow remain verification checks.

Tutor identities, prices, ratings, and availability are demonstration data. Bookings are prototype planning records. Payments, real lessons, tutor verification, calendar sync, and notifications are outside scope.

## AI development disclosure

AI assistance helped scaffold/review code, draft documentation, diagnose deployment, and create tests. The developer remains responsible for understanding and validating the source and model output. Simulated provider tests do not prove live reliability.

## Guides

- [Requirements and user stories](docs/PROJECT.md)
- [Wireframe and architecture](docs/DESIGN.md)
- [Source map](docs/PROJECT_MAP.md)
- [User guide](docs/USER_GUIDE.md)
- [API reference](docs/API_REFERENCE.md)
- [AI design and testing](docs/AI_AND_TESTING.md)
- [Build guide](docs/BUILD_GUIDE.md)
- [Security and privacy](docs/SECURITY_AND_PRIVACY.md)
- [Capstone Word document](Khanu%20Learning%20Capstone%20Documentation.docx)
