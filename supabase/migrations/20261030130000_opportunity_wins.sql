-- "Wins on listings" (docs/research/final-decisions.md §1e): a team, org, or
-- school says "we joined / we won"; a curator checks it, writes a one-line
-- headline in our own words, and it shows on that listing. Not a social feed:
-- no profiles, no open posting, no individual names without consent.

create table public.opportunity_wins (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  result text not null check (result in ('won', 'placed', 'finalist', 'joined')),
  team text not null check (length(team) between 2 and 120),
  detail text check (length(detail) <= 300),
  proof_url text check (proof_url ~ '^https://' and length(proof_url) <= 2000),
  -- The sender confirmed everyone named agreed to be featured (and a parent
  -- for anyone under 18).
  consent boolean not null check (consent),
  -- Written by the curator; the only text the public sees besides the result.
  headline text check (length(headline) <= 140),
  status text not null default 'new' check (status in ('new', 'published', 'rejected')),
  constraint opportunity_wins_published_has_headline check (status <> 'published' or headline is not null),
  reviewed_by uuid references auth.users (id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger opportunity_wins_set_updated_at
  before update on public.opportunity_wins
  for each row execute function public.set_updated_at();

create index opportunity_wins_status_idx on public.opportunity_wins (status, created_at);
create index opportunity_wins_opportunity_idx on public.opportunity_wins (opportunity_id);
create index opportunity_wins_user_idx on public.opportunity_wins (user_id);

alter table public.opportunity_wins enable row level security;

create policy "Students read their own wins"
  on public.opportunity_wins for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Curators read wins"
  on public.opportunity_wins for select to authenticated
  using ((select public.is_curator()));

create policy "Curators update wins"
  on public.opportunity_wins for update to authenticated
  using ((select public.is_curator()))
  with check ((select public.is_curator()));

-- Inserted by the server (secret key) after sign-in, 18+, captcha, and rate
-- limit checks.
revoke all on public.opportunity_wins from anon;
revoke insert, delete on public.opportunity_wins from authenticated;

-- What the public sees: published wins on published or expired listings.
-- Lists columns explicitly so internal ones can't become public by accident.
create view public.public_opportunity_wins as
select
  w.id,
  w.opportunity_id,
  w.result,
  w.headline,
  w.proof_url,
  w.published_at
from public.opportunity_wins w
join public.opportunities o on o.id = w.opportunity_id
where w.status = 'published' and o.status in ('published', 'expired');

revoke all on public.public_opportunity_wins from anon, authenticated;
grant select on public.public_opportunity_wins to anon, authenticated;
