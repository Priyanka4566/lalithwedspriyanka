alter table public.rsvps
  add column if not exists sangeet_alcohol text
  check (sangeet_alcohol is null or sangeet_alcohol in ('yes', 'no'));

create or replace function public.submit_rsvp(
  rsvp_id text,
  rsvp_party_key text,
  rsvp_name text,
  rsvp_email text,
  rsvp_status text,
  rsvp_event_ids jsonb,
  rsvp_guest_count integer,
  rsvp_message text,
  rsvp_sangeet_alcohol text default null
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
    sangeet_alcohol,
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
    rsvp_sangeet_alcohol,
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
    sangeet_alcohol = excluded.sangeet_alcohol,
    updated_at = now()
  returning *;
$$;
