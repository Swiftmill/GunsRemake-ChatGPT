# Guns Remake

A full-stack recreation of the guns.lol link-in-bio platform featuring customizable public profile pages, immersive theming, media backgrounds with music autoplay, admin badge management, analytics and S3-compatible asset hosting.

> **Stack:** React (Vite) + Tailwind UI, Express API with Sequelize (Postgres), JWT auth, Dockerized infrastructure with Postgres and MinIO.

## Features

- 🎨 **Custom public profiles** – reorderable sections, background video/image, autoplay music with mute control, badge display and gallery.
- 🪪 **Authentication** – email/password with JWT cookies plus Discord OAuth hand-off endpoint.
- 🛡️ **Admin control center** – manage users, create & assign badges, curate templates, view analytics.
- 📊 **Analytics** – per-profile view & link click tracking with daily aggregation.
- 📁 **Asset management** – upload images/video/audio (local disk or S3-compatible storage such as MinIO).
- 🧩 **Templates** – support for public/private templates with JSON import/export.
- 🚨 **Safety tooling** – rate limiting, upload validation, schema validation with Zod.
- 📱 **Responsive UI** – mobile-first layout mirroring guns.lol aesthetics.

## Project structure

```
.
├── backend/              # Express API + Sequelize models
├── frontend/             # Vite + React client
├── infra/                # Dockerfiles used by docker-compose
├── docker-compose.yml    # Local development stack (Postgres, MinIO, API, UI)
└── README.md
```

## Quick start (Docker)

1. Copy environment template:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Start the stack:
   ```bash
   docker compose up --build
   ```
3. Run the seed script once the containers are healthy:
   ```bash
   docker compose exec backend npm run seed
   ```
4. Visit the app:
   - Frontend: http://localhost:5173
   - API docs/health: http://localhost:4000/health

### MinIO bucket bootstrap

Create the bucket once after the stack starts (or use the MinIO console at http://localhost:9001):

```bash
docker compose exec minio mc alias set local http://minio:9000 minioadmin minioadmin
docker compose exec minio mc mb local/guns-assets
```

Seeded accounts:

| Role  | Email                       | Password       | Notes |
|-------|-----------------------------|----------------|-------|
| Admin | `admin@gunsremake.local`    | `ChangeMe123!` | Admin dashboard access |
| User  | `swift@gunsremake.local`    | `ChangeMe123!` | Sample profile |
| User  | `hris@gunsremake.local`     | `ChangeMe123!` | Sample profile |
| User  | `moh@gunsremake.local`      | `ChangeMe123!` | Analytics focus |

## Manual setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Seed database with sample users (optional):
```bash
npm run seed
```

The backend exposes REST endpoints under `http://localhost:4000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` calls to the backend.

## Testing & linting

- **Backend:** Add Jest/Vitest as desired (not bundled by default).
- **Frontend:** `npm run lint` inside the `frontend` workspace.

## API overview

- `POST /auth/register` / `POST /auth/login` – email credential flow.
- `POST /auth/discord` – Discord OAuth code exchange.
- `GET /profiles/me` / `PUT /profiles/me` – manage profile metadata.
- `POST /profiles/me/links` – CRUD + reorder for link buttons.
- `GET /profiles/public/:username` – fetch public page payload.
- `POST /profiles/public/:username/links/:linkId/click` – analytics tracking.
- `GET /admin/overview` – totals for dashboards.
- `POST /admin/badges` / `POST /admin/templates` – admin maintenance.
- `GET /assets` / `POST /assets` – asset manager (image/video/audio).

Authentication uses HTTP-only cookies; include `withCredentials` in client requests.

## Infrastructure notes

- Postgres is required (configured via `DATABASE_URL`).
- MinIO offers S3 compatibility. The included storage service falls back to local disk if S3 keys are unset.
- Rate limiting defaults to 100 req/min per IP (override via middleware options).

## Roadmap

- Websocket-driven live preview inside the editor.
- Rich theme marketplace with sharing links.
- Discord bot integration for automatic role badges.

Enjoy building neon profiles! ✨
