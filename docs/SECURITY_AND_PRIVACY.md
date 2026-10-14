# Security and privacy boundaries

## Full-stack mode

The Express backend hashes account passwords with bcrypt, signs expiring JWTs, validates request bodies, applies rate limits to account endpoints, sets security headers, and scopes booking queries to the authenticated user. Production deployment must use HTTPS, a strong server-only `JWT_SECRET`, a protected MongoDB connection string, and a database network policy appropriate to the host.

The optional language model endpoint is local and optional. The project contains no hosted AI API key and does not call a hosted AI service. The standard matcher can run without the language model.

## GitHub Pages demo

Pages serves public static HTML, CSS, and JavaScript. Its demo profile stores only a display name, and bookings are sample records stored in the visitor's browser. This client-side profile is not secure authentication, and local storage is not a private database. The Pages demo collects no email or password and should not be used with real learner records or sensitive notes.

For actual users, configure `VITE_API_BASE_URL` to an HTTPS backend with MongoDB. The API URL is public by design. Do not place database credentials, JWT secrets, passwords, private tokens, or model server credentials in `VITE_*` variables, frontend source, or Git history.

## Product limits

Sample tutor identities, availability, ratings, and prices are illustrative. Khanu does not currently verify tutors, process payments, send appointment confirmations, sync calendars, or provide tutoring/video calls. An appointment in this prototype is a saved planning record, not a confirmed real-world service.
