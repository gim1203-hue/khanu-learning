# GitHub Pages and full-stack deployment

## Choose a deployment mode

GitHub Pages publishes static website files. The supplied `.github/workflows/pages.yml` builds and deploys Khanu's React frontend. When `VITE_API_BASE_URL` is empty, it enables the browser demo: service search and matching work in the browser, and demo profiles/bookings are kept in local storage. This edition does not run Express, MongoDB, the optional local model server, or secure server accounts.

For real accounts and persistent shared booking records, deploy the Express backend and MongoDB on a separate host. GitHub Pages remains the frontend. A public backend should be configured with HTTPS and restricted production secrets.

## Publish the browser-demo edition

1. Open the `local-assistant` folder in VS Code.
2. Create a GitHub repository for the project. Do not include `.env`, `node_modules`, model weights, or runtime files; `.gitignore` excludes those local items.
3. Push the project source to the repository's `main` or `master` branch. The workflow deploys on pushes to those branches and can also be run manually from **Actions**.
4. In GitHub repository **Settings → Pages**, choose **GitHub Actions** as the build and deployment source.
5. Open the **Actions** tab and wait for “Build and publish Khanu to GitHub Pages” to succeed. GitHub reports the published URL in the `github-pages` environment and Pages settings.
6. Open that URL on desktop and mobile; try search, theme/color controls, a recommendation, demo profile, booking, refresh, and cancellation.

`npm run build:pages` sets the Vite base path from `GITHUB_REPOSITORY`, including the repository subpath used by project Pages sites. For an owner site named `<owner>.github.io`, it uses `/`.

## Connect a separately deployed backend (optional)

1. Deploy the Node/Express app from this repository or an API-only copy to a Node web host. Configure its start command as `npm start`; configure Node 20+, `NODE_ENV=production`, `MONGODB_URI`, and a unique long `JWT_SECRET` using the host's private environment settings. Do not publish those values.
2. Set `CLIENT_URL` to the exact GitHub Pages origin (for example, `https://<owner>.github.io`) if cross-origin requests need restriction. Use the API host's HTTPS origin.
3. In GitHub repository **Settings → Secrets and variables → Actions → Variables**, add `VITE_API_BASE_URL` with that HTTPS backend origin. This value is public and contains no secret.
4. Re-run the Pages workflow. The build sees `VITE_API_BASE_URL` and uses the API for accounts, bookings, catalog, and matching. A backend's CORS policy must allow the Pages origin.
5. Verify registration, login, ownership, future booking, cancellation, Mongo persistence after an API restart, and mobile layout. Use a dedicated test database and test-only account data.

The optional local model is designed for a local machine. A cloud API deployment cannot reach a user's `127.0.0.1`. Leave the model disabled for a hosted API or intentionally configure an approved server-side model service; keep any model credentials server-only. Deterministic recommendations remain available without an LLM.

## Local commands

```text
npm ci
npm test
npm run build:pages
```

For combined local frontend/API development use `npm run dev`; for a single local process use `npm run build` and `npm start`.

## Not yet completed

No GitHub remote or public URL is embedded in this source copy. Publishing requires the project to be pushed to the specific repository and Pages enabled for it. Full-stack persistence additionally requires a hosted backend and MongoDB connection. Do not call the Pages browser demo production authentication.

## Official GitHub guidance

- [GitHub Pages is static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
- [Automatic publishing with GitHub Actions](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically).
- [Custom workflows for Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
