# Project overview and requirements

## Problem and audience

Students often know they need help but cannot tell which service or tutor fits their subject, learning level, schedule, or budget. Khanu Learning helps learners compare focused tutoring sessions, receive a plain-language match recommendation, and book or manage appointments in one place. The primary users are middle-school and high-school learners, college applicants, language learners, and the parents or guardians who may help them plan.

## Scope

The full-stack capstone includes account creation and sign-in, a searchable service catalog, service descriptions and tutor details, a protected appointment flow, a learner dashboard, cancellation, a responsive interface, an AI-assisted tutor match, and MongoDB persistence. A transparent in-memory demo mode supports local evaluation without a database. A separate GitHub Pages browser demo demonstrates catalog, recommendations, and browser-local sample bookings without a backend. Payments, calendar-provider synchronization, tutor administration, and real-time video sessions are outside the current scope.

## User stories

- As a learner, I can create an account and sign in so my bookings belong to me.
- As a learner, I can browse and filter tutoring sessions by subject so I can find relevant support.
- As a learner who is unsure what to choose, I can describe my goal, level, and budget and receive ranked matches with reasons.
- As a learner, I can choose a future appointment date and add a note so the tutor knows what I want to work on.
- As a learner, I can review and cancel my upcoming appointments from a dashboard.
- As a visitor, I can explore the catalog and AI match tool before I create an account.
- As a learner, I can switch the app theme and robot-shell color to personalize the experience.
- As a reviewer, I can open a static GitHub Pages demo and try matching and sample booking flows without exposing credentials.

## Functional requirements

1. Register with name, email, and an eight-character-minimum password; prevent duplicate emails.
2. Authenticate with a signed token; hash passwords; protect account and booking endpoints.
3. Browse, search, and category-filter tutoring services and view price, level, duration, tutor, rating, and description.
4. Create an appointment for a future date, view the current user's bookings, and cancel an upcoming booking.
5. Recommend up to three catalog entries based on learner goal, subject, level, and budget, with readable match reasons. Use the optional local language model for an explanation when available.
6. Validate request data, return useful API errors, and keep each user limited to their own bookings.
7. Persist records in MongoDB when configured; provide clearly identified in-memory and browser-local demo modes otherwise.

## Non-functional requirements

- Responsive pages usable at phone, tablet, and desktop widths.
- Separate React presentation code, Express routes/controllers, Mongoose schemas, and recommendation logic.
- Password hashing, JWT authorization, security headers, basic authentication rate limiting, input validation, and environment-based secrets.
- Local-first AI: the deterministic matcher runs on the local Express server or in the Pages browser. The optional language model uses a configured local model endpoint; the project does not call a hosted AI provider.
- Usable without MongoDB for a review session, with an explicit warning that demo data does not persist.
- Production build served from the Express process and configured to bind to the hosting provider's port; a separate Vite build targets static Pages.

## Acceptance checks

- A new user can register, sign in, book a future session, see that session on My Sessions, and cancel it.
- An unrelated user cannot read or cancel another user's booking.
- A chemistry goal ranks Chemistry, Made Clear above unrelated options; budget and level affect ranking.
- The discovery filters and AI match controls work at mobile and desktop sizes.
- A MongoDB connection stores users, seeded services, and bookings; fallback demo mode is clearly signposted.
- The Pages demo can rank recommendations, create a browser-only profile, book and cancel a sample appointment, and retain those demo records in browser local storage.
