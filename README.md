# psychiatrie-rules

A Next.js app for managing psychiatry rules, powered by Supabase. Rules update in real time via Supabase Realtime, with an hourly keepalive to prevent connection timeouts. The Discord bot is a separate, external service.

Rule creation is restricted to a single explicitly configured admin account.

---

## Features

- Rules loaded dynamically from Supabase (`public.rules`)
- Per-rule flags: `is_new`, `is_limited_time`, time windows, priority
- Live updates without page reload via Supabase Realtime
- Password login via Supabase (dialog in the top-right corner)
- Server-side admin verification using `RULES_ADMIN_EMAIL`
- Hourly Supabase keepalive at `/api/cron/supabase-keepalive`

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | React 19 + TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (`@supabase/supabase-js`) |
| Validation | Zod |

---

## Setup

### 1. Install dependencies

```bash
bun install
```

### 2. Environment variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SECRET_KEY=...
RULES_ADMIN_EMAIL=your-admin@example.com
NEXT_PUBLIC_SUPABASE_LOGIN_EMAIL=your-admin@example.com  # optional
CRON_SECRET=...                                          # optional, recommended for keepalive route
```

> **Note:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` can alternatively be set as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.

### 3. Apply the database schema

Run `supabase/schema.sql` in the Supabase SQL Editor.

### 4. Enable Realtime for the `rules` table

In the Supabase dashboard, go to **Database → Replication** and enable Realtime for `public.rules`.

---

## Keepalive (every 60 minutes)

`vercel.json` includes a cron job (`0 * * * *`) that calls `GET /api/cron/supabase-keepalive`.

If `CRON_SECRET` is set, the endpoint will reject unauthorized requests. If you're not hosting on Vercel, call this endpoint hourly via an external scheduler.

---

## Admin flow

1. User opens the account dialog (user icon, top right).
2. Login calls `supabase.auth.signInWithPassword(...)`.
3. The returned access token is verified server-side against Supabase.
4. If `user.email === RULES_ADMIN_EMAIL`, the rule creation form is shown and `POST /api/rules` is permitted.

> **Note:** If `NEXT_PUBLIC_SUPABASE_LOGIN_EMAIL` is not set, a local login email is derived from the project ref (`<project-ref>@auth.local`). This value must match `RULES_ADMIN_EMAIL`.

---

## Scripts

```bash
bun dev          # Start development server
bun run lint     # Lint
bun run build    # Production build
```

---

## Data model

Table: `public.rules`

| Column | Type | Description |
|---|---|---|
| `content` | `text NOT NULL` | Rule text |
| `note` | `text` | Optional note |
| `is_new` | `boolean` | Marks rule as new |
| `is_limited_time` | `boolean` | Rule is time-limited |
| `limited_start_at` | `timestamptz` | Start of time window |
| `limited_end_at` | `timestamptz` | End of time window |
| `is_active` | `boolean` | Whether rule is active |
| `priority` | `integer` | Display priority |
| `created_by` | `text` | Creator identifier |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |
