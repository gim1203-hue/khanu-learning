# Build and VS Code guide

## Requirements

- Windows, macOS, or Linux.
- Node.js 20 or newer and npm.
- VS Code (recommended) or another editor.
- MongoDB only when persistent backend data is needed. A compatible local model service is optional.

## Open and run

1. Open the repository folder in VS Code.
2. Open **Terminal → New Terminal** in that folder.
3. Run `npm ci` to install the versions in `package-lock.json`.
4. Copy `.env.example` to `.env`. Set `JWT_SECRET` to a long random value before exposing the backend. Set `MONGODB_URI` for data persistence; leave it unset for clearly labeled temporary memory mode.
5. Run `npm run dev` and open `http://127.0.0.1:5173`.

For a production-like local run, execute `npm run build` followed by `npm start`; the combined app uses port 4173 by default.

## Verification

- `npm test` checks authentication, protected bookings, booking/cancellation, and both matchers.
- `npm run build` builds the React frontend served by Express.
- `npm run build:pages` builds the static Pages version, with `/repository-name/` path handling. It uses browser-demo mode unless `VITE_API_BASE_URL` points at a separately hosted API.

## Source editing tips

- UI: `frontend/src/App.jsx`, `frontend/src/components/`, `frontend/src/styles/app.css`.
- API behavior: `backend/src/routes/`, `backend/src/controllers/`, and `backend/src/services/`.
- Persistent schema: `backend/src/models/`.
- Static demo behavior: `frontend/src/services/localDemoApi.js` and `localMatching.js`.
- Docs: `docs/`.

Keep server-only secrets in ignored `.env` or hosting secrets. Any `VITE_*` value is compiled into browser JavaScript and must be considered public.

## Common issues

| Symptom | Fix |
|---|---|
| Node command missing | Install Node.js 20+, then reopen the terminal |
| `npm ci` fails | Confirm `package-lock.json` is present and rerun `npm ci` |
| Backend reports demo memory mode | Set a reachable `MONGODB_URI` in `.env` to persist records |
| Frontend cannot reach an API | In local development, run `npm run dev`; the Vite proxy expects Express at port 5000 |
| Pages opens a blank screen | Check Actions build logs and ensure the repository Pages source is GitHub Actions; verify `VITE_BASE_PATH` or the Pages workflow |
| Pages bookings disappear | Browser demo records live only in that browser's local storage; this is not backend persistence |
