-- Counts for the admin Stats page, computed in the database (PostgREST caps
-- plain selects at 1,000 rows). Server-only: called with the secret key after
-- a curator check.

create index if not exists analytics_events_created_idx on public.analytics_events (created_at);

create or replace function public.analytics_totals(since timestamptz)
returns table (event text, events bigint, visitors bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select e.event, count(*), count(distinct e.anonymous_id)
  from public.analytics_events e
  where e.created_at >= since
  group by e.event;
$$;

create or replace function public.analytics_top_listings(since timestamptz, max_rows int default 10)
returns table (opportunity_id uuid, title text, slug text, views bigint, official_clicks bigint, saves bigint, shares bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select
    o.id,
    o.title,
    o.slug,
    count(*) filter (where e.event = 'view'),
    count(*) filter (where e.event = 'official_click'),
    count(*) filter (where e.event = 'save'),
    count(*) filter (where e.event = 'share')
  from public.analytics_events e
  join public.opportunities o on o.id = e.opportunity_id
  where e.created_at >= since
  group by o.id, o.title, o.slug
  order by count(*) filter (where e.event = 'view') desc
  limit max_rows;
$$;

revoke execute on function public.analytics_totals(timestamptz) from public, anon, authenticated;
revoke execute on function public.analytics_top_listings(timestamptz, int) from public, anon, authenticated;
grant execute on function public.analytics_totals(timestamptz) to service_role;
grant execute on function public.analytics_top_listings(timestamptz, int) to service_role;
