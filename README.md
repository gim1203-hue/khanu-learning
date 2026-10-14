# Khanu Learning

Khanu Learning is a tutoring discovery and appointment-planning capstone. It helps learners compare focused lessons, describe what they need, see ranked suggestions with reasons, and save sessions to a learner dashboard. The animated Khanu robot is the study buddy and visual guide.

## What problem it solves

Learners may know they are stuck but not know which tutor, subject area, level, price, or next step fits. Khanu puts the catalog, a goal-based matching tool, booking, and a simple learning plan in one responsive experience. It is a planning and discovery prototype; the sample tutors and sessions are demo catalog data, not a live marketplace.

## Open in VS Code

1. Open this repository folder in VS Code.
2. Install Node.js 20 or newer.
3. In the VS Code terminal, run `npm ci`.
4. Copy `.env.example` to `.env` if you want to configure the backend. Set a long random `JWT_SECRET`; add `MONGODB_URI` to persist user and booking records.
5. Run `npm run dev` and open `http://127.0.0.1:5173`.

Use `npm run dev` while editing; use `npm run build` then `npm start` to preview the production build.

## GitHub Pages

Khanu Learning is published at [https://gim1203-hue.github.io/khanu-learning/](https://gim1203-hue.github.io/khanu-learning/). Its source repository is [gim1203-hue/khanu-learning](https://github.com/gim1203-hue/khanu-learning).

The project includes a GitHub Actions workflow at `.github/workflows/pages.yml`. It builds and publishes the static frontend from this repository's `main` or `master` branch after each push. GitHub Pages is configured to use **GitHub Actions**.

With no backend URL configured, the deployed Pages edition uses an explicitly labeled browser demo. Matching runs in the browser and demo profiles/bookings are stored in that browser's local storage. Do not enter a real password or sensitive student information into this demo. GitHub Pages cannot run Express, MongoDB, or the local model process. For real accounts and records, deploy the Express backend and MongoDB separately, then set the repository variable `VITE_API_BASE_URL` to the HTTPS backend origin. See [GitHub Pages and full-stack deployment](docs/DEPLOYMENT.md).

The GitHub workflow assumes `main` or `master`; change its branch list if your repository uses another default branch. The build script sets the correct Vite base path for project pages and owner pages.

## Features

- Responsive tutoring catalog with search and subject filters.
- Khanu animated live-view robot, color palette, and light/dark theme.
- Goal, subject, school level, and budget-aware tutor recommendations with explanations.
- Protected registration/sign-in, booking, learner dashboard, and cancellation in the Express version.
- Mongoose models and MongoDB persistence when `MONGODB_URI` is configured; clear in-memory fallback for local evaluation.
- Browser-only Pages demo for the static GitHub Pages edition.
- Optional local OpenAI-compatible language-model explanation. The deterministic matcher works without a model.

## Project services

This project demonstrates a sample tutoring catalog: **Algebra Foundations**, **SAT Math Boost**, **Essay Writing Workshop**, **Chemistry, Made Clear**, **Spanish Conversation Club**, and **College Application Coaching**. There are no live tutor accounts, payments, calendar integrations, or video sessions. See [Project overview](docs/PROJECT.md) and [User guide](docs/USER_GUIDE.md).

## Commands

| Command | Purpose |
|---|---|
| `npm ci` | Install the exact locked dependency versions |
| `npm run dev` | Run Vite and the Express API for local development |
| `npm test` | Run API, matcher, and browser-demo tests |
| `npm run build` | Build the full-stack local frontend |
| `npm run build:pages` | Build a GitHub Pages static edition with a repository-aware base path |
| `npm start` | Serve the production frontend and Express API together |

## Documentation

- [Project purpose, requirements, and boundaries](docs/PROJECT.md)
- [Design, architecture, and data model](docs/DESIGN.md)
- [Complete file and component guide](docs/PROJECT_MAP.md)
- [How to use Khanu](docs/USER_GUIDE.md)
- [API reference](docs/API_REFERENCE.md)
- [AI design and test plan](docs/AI_AND_TESTING.md)
- [Build and VS Code guide](docs/BUILD_GUIDE.md)
- [GitHub Pages and full-stack deployment](docs/DEPLOYMENT.md)
- [Privacy and security boundaries](docs/SECURITY_AND_PRIVACY.md)

## Current completion status

The source, local experience, browser demo, automated tests, production build, Pages workflow, and project documentation are included. The browser demo is live at https://gim1203-hue.github.io/khanu-learning/. Persistent production data and full backend hosting are not configured; they require a hosted API and MongoDB connection. Never commit `.env`, model files, passwords, or API keys.
