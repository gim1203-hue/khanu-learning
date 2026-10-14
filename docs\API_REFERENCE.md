# Express API reference

The local API base is `/api`. Requests and responses use JSON. Protected routes expect `Authorization: Bearer <token>`. Tokens are signed by the backend; only the backend should receive `JWT_SECRET`.

| Method | Route | Access | Purpose |
|---|---|---|---|
| `GET` | `/health` | Public | Server, database mode, and local-AI status |
| `GET` | `/services` | Public | List sessions; optional `q` and `category` query filters |
| `POST` | `/auth/register` | Public, rate-limited | Create user and return token/user |
| `POST` | `/auth/login` | Public, rate-limited | Verify credentials and return token/user |
| `GET` | `/auth/me` | Signed in | Return current user |
| `POST` | `/ai/recommend` | Public | Rank sessions from `goal`, `subject`, `level`, and `budget` |
| `GET` | `/bookings` | Signed in | List only the current user's bookings |
| `POST` | `/bookings` | Signed in | Create a future booking from `serviceSlug`, ISO `startsAt`, and optional `notes` |
| `PATCH` | `/bookings/:id/cancel` | Signed in | Cancel the current user's booking |

## Example recommendation request

```json
{
  "goal": "I need help balancing chemistry equations",
  "subject": "chemistry",
  "level": "High school",
  "budget": 50
}
```

The result contains up to three `{ service, score, reasons }` entries, a short explanation, and a `poweredBy` label. The API validates input and caps goal/subject/level lengths and budget.

## Example booking request

```json
{
  "serviceSlug": "chemistry-lab",
  "startsAt": "2027-03-15T18:00:00.000Z",
  "notes": "Review balancing equations"
}
```

The server checks that the service exists and the appointment is in the future. It snapshots the service title and tutor name. MongoDB mode stores the user relation as an ObjectId; demo mode uses temporary in-memory records. The browser Pages adapter is a separate local demo and does not call these account endpoints.
