# psychiatrie-rules

Next.js App für psychiatrie-regeln mit Supabase als Datenquelle,
Live-Updates via Supabase Realtime und stündlichem Keepalive.

Der Discord-Bot ist extern.
Diese Website liest Regeln live und erlaubt Rule-Creation nur
für einen explizit freigegebenen OAuth-Admin-Account.

## Features

- Dynamische Regeln aus Supabase (`public.rules`)
- Rule-Props: `is_new`, `is_limited_time`, Zeitfenster, Priorität
- Live-Updates ohne Reload über Supabase Realtime
- OAuth-Login via Supabase (Dialog oben rechts)
- Sichere Server-Prüfung für Admin-Aktionen (`RULES_ADMIN_EMAIL`)
- Stündlicher Supabase-Keepalive (`/api/cron/supabase-keepalive`)

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript (strict)
- Tailwind CSS + shadcn UI Komponenten
- Supabase (`@supabase/supabase-js`)
- Validation (`zod`)

## Setup

### 1. Dependencies

```bash
bun install
```

### 2. Umgebungsvariablen

`.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SECRET_KEY=...
RULES_ADMIN_EMAIL=dein-admin@beispiel.de
NEXT_PUBLIC_SUPABASE_OAUTH_PROVIDER=github # optional: github|discord|google
CRON_SECRET=... # optional, empfohlen für Keepalive-Route
```

Hinweis:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` kann alternativ als
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` gesetzt werden.

### 3. Supabase Schema ausrollen

Führe `supabase/schema.sql` im Supabase SQL Editor aus.

### 4. Realtime für `rules` aktivieren

In Supabase unter Database -> Replication:

- Realtime für Tabelle `public.rules` aktivieren

## Keepalive (60 Minuten)

- `vercel.json` enthält einen Cron `0 * * * *`
- Endpoint: `GET /api/cron/supabase-keepalive`
- Mit `CRON_SECRET` nur autorisierte Aufrufe erlaubt

Wenn du nicht auf Vercel bist, rufe den Endpoint stündlich extern auf.

## OAuth Admin-Flow

1. User öffnet den Account-Dialog (User-Icon oben rechts).
2. Login startet `supabase.auth.signInWithOAuth(...)`.
3. Nach Login wird der Access Token gegen Supabase verifiziert.
4. Nur wenn `user.email === RULES_ADMIN_EMAIL`:
   Rule-Form sichtbar und `POST /api/rules` erlaubt.

## Scripts

- `bun dev` Entwicklungsserver
- `bun run lint` Lint
- `bun run build` Build

## Datenmodell

Relevante Tabelle: `public.rules`

- `content text not null`
- `note text`
- `is_new boolean`
- `is_limited_time boolean`
- `limited_start_at timestamptz`
- `limited_end_at timestamptz`
- `is_active boolean`
- `priority integer`
- `created_by text`
- `created_at`, `updated_at`
