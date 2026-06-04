create table if not exists public.rsvps (
  id text primary key,
  party_key text not null unique,
  name text not null,
  email text,
  status text not null check (status in ('all', 'selected', 'decline')),
  event_ids jsonb not null default '[]'::jsonb,
  guest_count integer not null default 0 check (guest_count >= 0 and guest_count <= 10),
  message text,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create or replace function public.submit_rsvp(
  rsvp_id text,
  rsvp_party_key text,
  rsvp_name text,
  rsvp_email text,
  rsvp_status text,
  rsvp_event_ids jsonb,
  rsvp_guest_count integer,
  rsvp_message text
)
returns public.rsvps
language sql
security definer
set search_path = public
as $$
  insert into public.rsvps (
    id,
    party_key,
    name,
    email,
    status,
    event_ids,
    guest_count,
    message,
    created_at,
    updated_at
  )
  values (
    rsvp_id,
    rsvp_party_key,
    rsvp_name,
    rsvp_email,
    rsvp_status,
    rsvp_event_ids,
    rsvp_guest_count,
    rsvp_message,
    now(),
    now()
  )
  on conflict (party_key) do update set
    name = excluded.name,
    email = excluded.email,
    status = excluded.status,
    event_ids = excluded.event_ids,
    guest_count = excluded.guest_count,
    message = excluded.message,
    updated_at = now()
  returning *;
$$;
