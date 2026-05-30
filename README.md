# Priyanka & Lalith Wedding Invitation

This is the Next.js version of the original single-file wedding invitation.

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## RSVP

RSVPs now submit to the internal API route at `/api/rsvp`.

Local development stores responses in `data/rsvps.json`. That file is ignored by git because it contains guest data and is only meant for local testing.

The admin dashboard is available at:

```txt
http://localhost:3000/admin
```

Set `ADMIN_TOKEN` before hosting. In local development, the summary API is open if `ADMIN_TOKEN` is not set; in production, the token is required.

## Production Storage

For hosting, use Supabase by setting:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_TOKEN=...
```

Create the Supabase table:

```sql
create table if not exists public.rsvps (
  id text primary key,
  party_key text not null unique,
  name text not null,
  email text,
  status text not null,
  event_ids jsonb not null default '[]'::jsonb,
  guest_count integer not null default 0,
  message text,
  created_at timestamptz not null,
  updated_at timestamptz not null
);
```

The service role key is used only on server routes. Do not expose it as a `NEXT_PUBLIC_` variable.
