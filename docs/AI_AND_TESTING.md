# AI design and testing

Khanu scores catalog entries by goal, subject, level, budget, and rating. Express sends the ranked options and preferences to Google Gemini, currently gemini-3.5-flash-lite, using native Interactions. The model explains the first choice and does not perform bookings. Blank budget and level are unspecified. Prompt constraints discourage invented services, availability, and outcomes, but do not guarantee factual accuracy.

Generated results report ai.status=generated and Khanu AI + smart matching. Failures report fallback, keep catalog cards, and display an honest notice. Google has a 45-second total timeout including one bounded retry for selected temporary server errors. Compatible non-Google providers use 20 seconds. Local model discovery remains available for development.

## Evidence on November 4 2026

- Automated suite: 15 passing tests covering auth, bookings, scoring, browser demo, hosted/local explanations, provider failures, diagnostics, retry bounds, and unspecified preferences.
- Live API: registration, login, duplicate account rejection, invalid credentials/tokens, booking, cancellation, filtering, and cross-account isolation passed.
- MongoDB: connectivity and database-backed request paths are confirmed; a controlled restart-persistence check remains outstanding.
- Live AI: user screenshots demonstrate generated explanations and corrected blank-budget handling. Other calls returned 503 or timed out. Reliable availability is not established.
- UI: desktop matching/filtering and a basic 390px layout check were performed. Broader device testing, full browser-driven account workflows, and accessibility review remain.

Run npm test, npm run build, and npm run build:pages before submission. Use fictional learner details in live checks. Preserve both successes and failures. Simulated tests do not establish provider reliability.

## AI development disclosure

AI assistance helped scaffold and review code, draft documentation, diagnose deployment errors, and create tests. The developer remains responsible for understanding the source, auth, schemas, matching, provider data boundary, and fallback behavior.

See [AI setup](AI_SETUP.md) and [privacy](SECURITY_AND_PRIVACY.md).
