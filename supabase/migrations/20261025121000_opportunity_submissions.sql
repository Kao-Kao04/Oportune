-- "Submit an opportunity": signed-in students and organizers send a link.
-- Inserted by the server (secret key) after a rate limit and captcha check;
-- curators review the official source before creating a listing.

create table public.opportunity_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  url text not null check (url ~ '^https://' and length(url) <= 2000),
  title text check (length(title) <= 200),
  organization text check (length(organization) <= 200),
  deadline date,
  note text check (length(note) <= 1000),
  submitter_role text not null default 'student'
    check (submitter_role in ('student', 'organizer', 'school', 'other')),
  status text not null default 'new'
    check (status in ('new', 'added', 'duplicate', 'rejected')),
  opportunity_id uuid references public.opportunities (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger opportunity_submissions_set_updated_at
  before update on public.opportunity_submissions
  for each row execute function public.set_updated_at();

create index opportunity_submissions_status_idx on public.opportunity_submissions (status, created_at);
create index opportunity_submissions_user_idx on public.opportunity_submissions (user_id);

alter table public.opportunity_submissions enable row level security;

create policy "Students read their own submissions"
  on public.opportunity_submissions for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Curators read submissions"
  on public.opportunity_submissions for select to authenticated
  using ((select public.is_curator()));

create policy "Curators update submissions"
  on public.opportunity_submissions for update to authenticated
  using ((select public.is_curator()))
  with check ((select public.is_curator()));

revoke all on public.opportunity_submissions from anon;
revoke insert, delete on public.opportunity_submissions from authenticated;
