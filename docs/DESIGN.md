# Design, architecture, and data model

## Wireframe

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Khanu logo                 Find a tutor   My sessions        Theme   Account │
├──────────────────────────────────────────────────────────────────────────────┤
│ YOUR LEARNING, YOUR WAY                  ┌──────────────────────┐           │
│ Good help changes how you learn.         │ Live animated Khanu  │           │
│ Intro · explore sessions                 │ robot · theme color  │           │
│ Learner trust signals                    └──────────────────────┘           │
├──────────────────────────────────────────────────────────────────────────────┤
│ KHANU AI STUDY BUDDY      │ Goal text area                                │
│ Why matching works        │ Subject · level · budget · Find my best fit   │
├──────────────────────────────────────────────────────────────────────────────┤
│ YOUR KHANU MATCHES (after submit) · explanation · up to 3 match cards       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Find your kind of tutor · search                              categories    │
│ [session card]              [session card]               [session card]     │
├──────────────────────────────────────────────────────────────────────────────┤
│ Footer                                                                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

On smaller screens, navigation collapses into a menu, the hero and AI section stack vertically, filters scroll horizontally, and service cards use one column. The My Sessions view presents appointment summaries and cancellation actions.

## Full-stack architecture

```text
React + Vite (frontend/src)
        │ JSON REST requests; bearer token
        ▼
Express (backend/src/routes → controllers → services)
        ├── Mongoose models → MongoDB
        └── Khanu recommendation engine → optional local OpenAI-compatible model
```

The frontend owns presentation and interaction state. Express validates requests, enforces authentication/ownership, and coordinates business operations. Mongoose defines persistent documents. The recommendation service ranks catalog items locally before asking an optional local model to phrase its top match. If that model is unavailable, the deterministic ranker still returns usable matches.

## Static GitHub Pages edition

```text
React + Vite static build
   ├── catalog and deterministic matching run in the browser
   └── profile name + sample bookings → this browser's local storage
```

GitHub Pages cannot execute this repository's Express server, connect to MongoDB, or reach a visitor's local model process. The static demo adapter implements the browse/match/sample-booking contract in browser JavaScript, stores only a display name and sample booking details in local storage, and is visibly labeled as a demo. When `VITE_API_BASE_URL` is configured, the frontend instead sends API calls to the separate HTTPS backend; its URL is public configuration, never a secret.

## MongoDB entities

| Entity | Main fields | Relationship |
|---|---|---|
| User | name, email (unique, lowercase), passwordHash, timestamps | One user has many bookings |
| Service | slug (unique), title, category, duration, price, level, format, tutor, rating, tags, description | Referenced by booking slug |
| Booking | user ObjectId, serviceSlug, serviceTitle, tutor, startsAt, notes, status, timestamps | Belongs to one user and one catalog service |

Passwords are stored as bcrypt hashes. Booking queries always filter by the signed-in user's ID. A service title and tutor snapshot is stored with a booking so its display remains stable if the catalog later changes.

## Security and privacy

The backend validates payloads with Zod, hashes passwords with bcrypt, signs expiring JWTs, rate-limits login and registration, sets HTTP security headers, and checks ownership for booking operations. Production must use a strong `JWT_SECRET`, HTTPS, MongoDB Atlas network restrictions, and a suitable secret manager. The AI feature calls only the configured local model URL. The demo fallback is volatile and clearly labeled.

The Pages demo does not provide secure authentication or shared records. It deliberately asks for no email/password. Do not use it for real learner information. See [privacy and security boundaries](SECURITY_AND_PRIVACY.md).
