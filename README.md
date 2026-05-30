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

## Deploy To Vercel

This app includes `vercel.json`, so Vercel will install dependencies with `npm install` and build with `npm run build`.

1. Import this GitHub repo into Vercel.
2. Add these Vercel environment variables from `.env.example`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_TOKEN`
3. Deploy the project.
4. Add the GoDaddy domain in Vercel, then copy the DNS records Vercel gives you into GoDaddy DNS.

RSVP storage requires Supabase in production. Local file storage is only for local development.
