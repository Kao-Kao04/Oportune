-- Validation sprint (docs/validation/06-30-day-validation-sprint.md):
-- count visitors per campus org (?ref=) and how many come back in a later week.

-- 'visit': one per browser per day, so visitors who never open a listing count too.
alter table public.analytics_events drop constraint if exists analytics_events_event_check;
alter table public.analytics_events
  add constraint analytics_events_event_check
  check (event in ('view', 'official_click', 'save', 'share', 'reminder_open', 'visit'));

-- The ?ref= tag a browser first arrived with (e.g. gdg-pup). Short slug only.
alter table public.analytics_events
  add column ref text check (ref ~ '^[a-z0-9-]{2,40}$');

-- Per source: visitors, visitors seen in 2+ different weeks (Manila time), and
-- what they did. A visitor's source is the first ref their events carry.
create or replace function public.analytics_by_ref(since timestamptz)
returns table (
  ref text,
  visitors bigint,
  returning_visitors bigint,
  views bigint,
  official_clicks bigint,
  shares bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  with per_visitor as (
    select
      coalesce((array_agg(e.ref order by e.created_at) filter (where e.ref is not null))[1], '(direct)') as ref,
      count(distinct date_trunc('week', e.created_at at time zone 'Asia/Manila')) as weeks,
      count(*) filter (where e.event = 'view') as views,
      count(*) filter (where e.event = 'official_click') as official_clicks,
      count(*) filter (where e.event = 'share') as shares
    from public.analytics_events e
    where e.created_at >= since and e.anonymous_id is not null
    group by e.anonymous_id
  )
  select
    p.ref,
    count(*),
    count(*) filter (where p.weeks >= 2),
    sum(p.views)::bigint,
    sum(p.official_clicks)::bigint,
    sum(p.shares)::bigint
  from per_visitor p
  group by p.ref
  order by count(*) desc;
$$;

revoke execute on function public.analytics_by_ref(timestamptz) from public, anon, authenticated;
grant execute on function public.analytics_by_ref(timestamptz) to service_role;
