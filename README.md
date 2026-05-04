# Insighta Labs+ Web Portal

Web client for the Insighta Labs+ demographic intelligence API. It uses the Next.js App Router with server-side data fetching, HTTP-only cookies for tokens, and a teal-themed layout with sidebar navigation.

## Features

- **GitHub sign-in** — PKCE-based redirect to the backend OAuth flow; tokens are sealed into cookies via `POST /api/auth/login` on `/callback`.
- **Authenticated area** — Dashboard, paginated profiles, profile detail, search, and account pages. Session uses `Authorization: Bearer` from the server with cookies (not exposed to client JS).
- **Admin CSV import** — `/profiles/import` uploads a CSV through a server action that proxies to `POST {BACKEND}/api/profiles/import` with admin verification (`x-user-role` is set only after `/api/users/me` confirms the `admin` role).
- **Security** — HTTP-only, `SameSite=strict` cookies; API calls include `X-API-Version: 1` where applicable.

## Tech stack

| Layer    | Choice                          |
| -------- | ------------------------------- |
| Framework | Next.js 16 (App Router), React 19 |
| Language  | TypeScript                      |
| Styling   | Tailwind CSS v4                 |
| Icons     | Lucide React                    |
| HTTP      | Native `fetch`, axios (callback) |

Read `node_modules/next/dist/docs/` when upgrading Next.js; this project may use conventions that differ from older Next.js releases.

## Prerequisites

- Node.js compatible with Next.js 16
- A running Insighta backend that exposes OAuth, `/api/users/me`, `/api/profiles`, `/api/profiles/search`, and (for admins) `/api/profiles/import`

## Setup

```bash
git clone https://github.com/Goldeno10/insighta-web.git
cd insighta-web
npm install
```

Create `.env.local` in the project root:

```env
# Required: base URL of the Insighta API (no trailing slash)
NEXT_PUBLIC_BACKEND_URL=https://https://hng-14-internship.vercel.app
```

Example for local API development:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Development server       |
| `npm run build`| Production build         |
| `npm run start`| Serve production build     |
| `npm run lint` | ESLint                   |

## Authentication flow

1. User opens `/` and chooses **Continue with GitHub**; PKCE parameters are stored and the browser navigates to `{BACKEND}/auth/github?...`.
2. After OAuth, the backend redirects to `/callback` with tokens in the query string.
3. The client posts tokens to this app’s `POST /api/auth/login`, which sets `access_token` and `refresh_token` as HTTP-only cookies.
4. The user is redirected to `/dashboard`.

## Route overview

| Path              | Purpose                                      |
| ----------------- | -------------------------------------------- |
| `/`               | Login                                        |
| `/callback`       | OAuth callback; seals cookies                |
| `/dashboard`      | Summary metrics                              |
| `/profiles`       | Paginated profile table                      |
| `/profiles/[id]`  | Profile detail                               |
| `/profiles/import`| Admin CSV import (admin role only)           |
| `/search`         | Profile search (`q`, `page` query params)    |
| `/account`        | Current user from `/api/users/me`           |

## Large CSV imports

Server actions use an increased body size limit (`experimental.serverActions.bodySizeLimit` in `next.config.ts`, default `32mb` in this repo). Increase it if your CSVs are larger; for very large files you may prefer a dedicated streaming upload route.

## License

MIT
