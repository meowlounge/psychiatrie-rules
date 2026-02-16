# psychiatrie-rules

Next.js App für psychiatrie-regeln mit Supabase als Datenquelle,
Live-Updates via Supabase Realtime und stündlichem Keepalive.

Der Discord-Bot ist extern.
Diese Website liest Regeln live und kann mit einem kurzlebigen
Admin-Link Regeln erstellen.

## Features

- Dynamische Regeln aus Supabase (`public.rules`)
- Rule-Props: `is_new`, `is_limited_time`, Zeitfenster, Priorität
- Live-Updates ohne Reload über Supabase Realtime
- No-Login Admin-Flow via signiertem Link (`?admin=...`)
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
RULES_ADMIN_TOKEN_SECRET=...
ADMIN_LINK_ISSUER_SECRET=...
APP_BASE_URL=https://deine-domain.tld # optional, empfohlen
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

## No-Login Admin-Link Flow

1. Discord-Bot ruft `POST /api/admin-links` auf
2. Bot sendet den erzeugten Link an einen Admin
3. Admin öffnet `/?admin=<token>` und sieht das Rule-Form
4. Rule-Create läuft über `POST /api/rules` mit Bearer-Token

`POST /api/admin-links` Auth:

- `Authorization: Bearer <ADMIN_LINK_ISSUER_SECRET>`
- oder `x-admin-link-secret: <ADMIN_LINK_ISSUER_SECRET>`

Beispiel Payload:

```json
{
	"ttlMinutes": 30,
	"actor": "discord-user-id",
	"issuer": "discord-bot"
}
```

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
