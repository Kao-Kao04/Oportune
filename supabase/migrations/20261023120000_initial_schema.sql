-- Oportune MVP schema. See docs/system-design/03-data-model.md.
-- Allowed values use text + check constraints (easier to extend than enums).

create extension if not exists pg_trgm with schema extensions;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Roles: no row = student. Students can't write this table (no write policies);
-- admins change roles through a server action using the secret key.
-- ---------------------------------------------------------------------------

create table public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('curator', 'admin')),
  granted_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- security definer so policies can call these without recursing into RLS.
create or replace function public.is_curator()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role in ('curator', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;

alter table public.user_roles enable row level security;

create policy "Users read their own role"
  on public.user_roles for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Admins read all roles"
  on public.user_roles for select to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Profiles (one per auth user, created by trigger on sign-up)
-- ---------------------------------------------------------------------------

create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  school text,
  course_group text check (course_group in (
    'it_cs', 'engineering', 'health', 'education', 'business',
    'arts_humanities', 'sciences', 'agriculture', 'other'
  )),
  course text,
  year_level text check (year_level in ('1', '2', '3', '4', '5', 'graduating')),
  interests text[] not null default '{}',
  is_18_or_over boolean,
  email_reminders_enabled boolean not null default true,
  push_reminders_enabled boolean not null default true,
  email_unsubscribe_token text not null unique default replace(gen_random_uuid()::text, '-', ''),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Users read their own profile"
  on public.profiles for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Users update their own profile"
  on public.profiles for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Students may only edit the quick-profile and reminder fields.
revoke update on public.profiles from anon, authenticated;
grant update (
  display_name, school, course_group, course, year_level, interests,
  is_18_or_over, email_reminders_enabled, push_reminders_enabled
) on public.profiles to authenticated;
revoke insert, delete on public.profiles from anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Categories (seeded from data/categories.csv)
-- ---------------------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

alter table public.categories enable row level security;

create policy "Anyone reads categories"
  on public.categories for select to anon, authenticated
  using (true);

create policy "Curators manage categories"
  on public.categories for all to authenticated
  using ((select public.is_curator()))
  with check ((select public.is_curator()));

-- ---------------------------------------------------------------------------
-- Opportunities. The public never reads this table directly; it reads the
-- public_opportunities view below, which hides internal columns.
-- ---------------------------------------------------------------------------

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  slug text not null unique,
  title text not null,
  organization text not null,
  category_id uuid not null references public.categories (id),
  summary text,
  eligibility text,
  requirements text,
  location text,
  delivery_mode text check (delivery_mode in ('online', 'in_person', 'hybrid')),
  application_opens date,
  application_opens_type text not null default 'tba'
    check (application_opens_type in ('date', 'open', 'rolling', 'tba')),
  deadline date,
  deadline_type text not null default 'tba'
    check (deadline_type in ('date', 'rolling', 'tba')),
  source_url text not null check (source_url like 'https://%'),
  application_url text check (application_url like 'https://%'),
  source_trust text not null default 'other'
    check (source_trust in ('official_gov', 'official_edu', 'other')),
  confidence text check (confidence in ('high', 'medium', 'low')),
  needs_check boolean not null default false,
  recheck_due boolean not null default false,
  notes text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'expired', 'archived')),
  last_checked_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  reviewed_by uuid references auth.users (id) on delete set null,
  search_vector tsvector generated always as (
    to_tsvector(
      'simple'::regconfig,
      coalesce(title, '') || ' ' || coalesce(organization, '') || ' ' || coalesce(summary, '')
    )
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_url, title),
  -- A dated deadline needs a date; rolling/TBA must not have one.
  check ((deadline_type = 'date') = (deadline is not null)),
  check ((application_opens_type = 'date') = (application_opens is not null)),
  -- needs_check rows can't be published until a curator clears the flag.
  check (not (needs_check and status = 'published'))
);

create trigger opportunities_set_updated_at
  before update on public.opportunities
  for each row execute function public.set_updated_at();

create index opportunities_status_deadline_idx on public.opportunities (status, deadline);
create index opportunities_category_idx on public.opportunities (category_id);
create index opportunities_search_idx on public.opportunities using gin (search_vector);
create index opportunities_title_trgm_idx
  on public.opportunities using gin (title extensions.gin_trgm_ops);
create index opportunities_organization_trgm_idx
  on public.opportunities using gin (organization extensions.gin_trgm_ops);

alter table public.opportunities enable row level security;

create policy "Curators manage opportunities"
  on public.opportunities for all to authenticated
  using ((select public.is_curator()))
  with check ((select public.is_curator()));

revoke all on public.opportunities from anon;

-- Lets policies check a listing's status without reading the locked table.
create or replace function public.is_published_opportunity(opportunity uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.opportunities where id = opportunity and status = 'published'
  );
$$;

-- Runs with the owner's rights (security_invoker off) so it can read the locked
-- table. Lists columns explicitly: never select *, so new internal columns
-- can't become public by accident.
create view public.public_opportunities as
select
  o.id,
  o.slug,
  o.title,
  o.organization,
  o.category_id,
  c.name as category_name,
  c.slug as category_slug,
  o.summary,
  o.eligibility,
  o.requirements,
  o.location,
  o.delivery_mode,
  o.application_opens,
  o.application_opens_type,
  o.deadline,
  o.deadline_type,
  o.source_url,
  coalesce(o.application_url, o.source_url) as application_url,
  o.source_trust,
  o.status,
  o.last_checked_at,
  o.search_vector,
  o.updated_at
from public.opportunities o
join public.categories c on c.id = o.category_id
where o.status in ('published', 'expired');

revoke all on public.public_opportunities from anon, authenticated;
grant select on public.public_opportunities to anon, authenticated;

create table public.opportunity_slug_redirects (
  old_slug text primary key,
  opportunity_id uuid not null references public.opportunities (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.opportunity_slug_redirects enable row level security;

create policy "Anyone reads slug redirects"
  on public.opportunity_slug_redirects for select to anon, authenticated
  using (true);

create policy "Curators manage slug redirects"
  on public.opportunity_slug_redirects for all to authenticated
  using ((select public.is_curator()))
  with check ((select public.is_curator()));

-- ---------------------------------------------------------------------------
-- Reports (inserted by the server after rate limit + captcha)
-- ---------------------------------------------------------------------------

create table public.opportunity_reports (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  reason text not null check (reason in ('wrong_info', 'expired', 'scam', 'other')),
  details text,
  status text not null default 'open' check (status in ('open', 'fixed', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger opportunity_reports_set_updated_at
  before update on public.opportunity_reports
  for each row execute function public.set_updated_at();

create index opportunity_reports_opportunity_idx on public.opportunity_reports (opportunity_id);
create index opportunity_reports_user_idx on public.opportunity_reports (user_id);

alter table public.opportunity_reports enable row level security;

create policy "Curators read reports"
  on public.opportunity_reports for select to authenticated
  using ((select public.is_curator()));

create policy "Curators update reports"
  on public.opportunity_reports for update to authenticated
  using ((select public.is_curator()))
  with check ((select public.is_curator()));

-- ---------------------------------------------------------------------------
-- Saved opportunities
-- ---------------------------------------------------------------------------

create table public.saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  opportunity_id uuid not null references public.opportunities (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
);

create index saved_opportunities_opportunity_idx on public.saved_opportunities (opportunity_id);

alter table public.saved_opportunities enable row level security;

create policy "Users read their saved listings"
  on public.saved_opportunities for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Users save published listings"
  on public.saved_opportunities for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and public.is_published_opportunity(opportunity_id)
  );

create policy "Users unsave their listings"
  on public.saved_opportunities for delete to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Push subscriptions
-- ---------------------------------------------------------------------------

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger push_subscriptions_set_updated_at
  before update on public.push_subscriptions
  for each row execute function public.set_updated_at();

create index push_subscriptions_user_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

create policy "Users manage their push subscriptions"
  on public.push_subscriptions for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Notifications: a log of reminders actually sent, written by the reminder job.
-- ---------------------------------------------------------------------------

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  opportunity_id uuid not null references public.opportunities (id) on delete cascade,
  channel text not null check (channel in ('email', 'push')),
  type text not null check (type in ('deadline_7d', 'deadline_1d')),
  deadline_on date not null,
  sent_at timestamptz,
  delivery_status text not null default 'sent'
    check (delivery_status in ('sent', 'failed', 'skipped')),
  -- user_id:opportunity_id:type:channel:deadline_on
  deduplication_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger notifications_set_updated_at
  before update on public.notifications
  for each row execute function public.set_updated_at();

create index notifications_user_idx on public.notifications (user_id);
create index notifications_opportunity_idx on public.notifications (opportunity_id);

alter table public.notifications enable row level security;

create policy "Users read their notifications"
  on public.notifications for select to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Audit log, rate limits, job runs, analytics (server-only writes)
-- ---------------------------------------------------------------------------

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index audit_logs_actor_idx on public.audit_logs (actor_id);

alter table public.audit_logs enable row level security;

create policy "Curators read the audit log"
  on public.audit_logs for select to authenticated
  using ((select public.is_curator()));

create table public.rate_limits (
  key text not null,
  window_start timestamptz not null,
  count int not null default 0,
  primary key (key, window_start)
);

alter table public.rate_limits enable row level security;

create table public.job_runs (
  id uuid primary key default gen_random_uuid(),
  job text not null check (job in ('auto_expire', 'send_reminders', 'cleanup')),
  run_for_date date not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running' check (status in ('running', 'ok', 'failed')),
  sent_count int not null default 0,
  failed_count int not null default 0,
  error text
);

create index job_runs_job_date_idx on public.job_runs (job, run_for_date);

alter table public.job_runs enable row level security;

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event text not null check (event in ('view', 'official_click', 'save', 'share', 'reminder_open')),
  opportunity_id uuid references public.opportunities (id) on delete set null,
  anonymous_id text,
  created_at timestamptz not null default now()
);

create index analytics_events_opportunity_idx on public.analytics_events (opportunity_id);

alter table public.analytics_events enable row level security;

-- No policies on rate_limits, job_runs, or analytics_events: only the server
-- (secret key) touches them.
revoke all on public.rate_limits, public.job_runs, public.analytics_events
  from anon, authenticated;
