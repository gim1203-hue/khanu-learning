# Security and privacy

Express validates input, hashes passwords, issues expiring JWTs, rate-limits auth and AI requests, and scopes bookings to the signed-in user. MongoDB stores records. Browser tokens use local storage, so XSS remains a production-hardening consideration.

## Hosted AI data

Google Gemini receives learner goal, subject, level, budget, and ranked public catalog facts through Express. Email, password, JWT, and booking notes are not included in that payload. Avoid personal details in goals. The native request uses store=false; provider retention and data-use policies still apply. This is not a claim of zero retention or on-device processing.

AI_API_KEY, JWT_SECRET, and MONGODB_URI belong only in private Render Environment settings or ignored local .env. Never put secrets in VITE_* variables, screenshots, or Git. Provider errors are sanitized before server logging.

## Modes and boundaries

The main Render application uses MongoDB and server authentication. Pages can use that same API; only a build without an API origin uses browser-local demo profiles/bookings, which are not secure authentication. An unconfigured local database falls back to clearly labeled volatile memory.

AI availability is intermittent. A bounded request and one retry for selected transient 5xx failures precede an explicit scoring fallback. Rate limiting is not a spending cap; configure provider usage limits separately. Render trusts its nearest proxy hop; other proxy topologies need review.

Sample tutors, ratings, prices, and availability are illustrative. Bookings are prototype planning records, not confirmed real-world lessons. Payments, tutor verification, notifications, calendar sync, and video lessons are outside scope.
