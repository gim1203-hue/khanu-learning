# AI feature and validation plan

## AI-powered tutor matching

The matchmaker is part of the learner workflow on the discovery page. A learner describes a goal and may add subject, level, and maximum price. A content-based ranker tokenizes the goal, compares it with service titles, levels, descriptions, and tags, and weights title matches above broader context matches. Level and budget constraints contribute to the ranking. The top three matches include specific reasons.

In the full-stack version, when a local OpenAI-compatible Qwen service is online, Khanu sends the ranked choices and learner preferences to that local endpoint to generate a concise explanation. The prompt limits the model to catalog options and tells it not to claim to book appointments. If the model is offline or returns an error, the local ranker still provides the match cards and a useful explanation. No hosted model key is required. In the Pages edition, matching runs in browser JavaScript with no server/model request; the UI identifies this as browser-local smart matching.

## Test plan

| Area | Check | Expected result |
|---|---|---|
| Matching | Algebra equations and middle-school level, $50 budget | Algebra Foundations ranks first with a level/budget reason |
| Matching | Broad learning goal | Three ranked catalog options are returned |
| Auth | Register with valid details | Account and token returned; password stored only as a hash |
| Auth | Register duplicate email / invalid password | Clear 409 / 400 response |
| Auth | Access protected route without token | 401 response |
| Catalog | Search chemistry and filter Science | Matching service only |
| Booking | Create a future booking | Booking appears on the current user's dashboard |
| Booking | Create a past booking | 400 response; no record created |
| Authorization | Request/cancel another user's booking | 404 response; record unchanged |
| UI | Mobile and desktop layout, theme toggle, robot color selector | Navigation and controls remain usable |
| Persistence | Run with MongoDB URI and restart | Mongo-backed user, catalog, and bookings remain |
| Demo | Run without MongoDB URI | Catalog/matcher work and the UI warns that accounts/bookings are temporary |
| Pages | Build with `npm run build:pages` | Repository base path is applied and static browser-demo mode is selected |
| Pages profile | Enter a display name | Browser demo works without collecting an email or password |
| Pages booking | Create, refresh, and cancel a sample session | Booking persists in browser local storage and remains labeled as demo data |

## Automated checks

`npm test` runs API workflow, backend matcher, and browser-demo tests. `npm run build` checks the local full-stack bundle. `npm run build:pages` builds the static edition. The register-book-cancel workflow and Mongo persistence should be run against a configured test database before a public full-stack release.

## AI use disclosure

AI assistance was used to help scaffold UI and API code, plan the architecture, draft project documentation, and create focused checks. The recommendation logic is readable and deterministic, with an optional local language-model explanation. Before submission, the developer should walk through the source, run the workflows, inspect environment settings, and explain the database model and matching behavior.
