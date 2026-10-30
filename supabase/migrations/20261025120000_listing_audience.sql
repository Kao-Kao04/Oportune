-- Who a listing is for (docs/research/final-decisions.md): regions, course
-- groups, and year levels. An empty array means "open to all".

alter table public.opportunities
  add column regions text[] not null default '{}',
  add column course_groups text[] not null default '{}',
  add column year_levels text[] not null default '{}';

alter table public.opportunities
  add constraint opportunities_regions_known check (regions <@ array[
    'ncr', 'car', 'ilocos', 'cagayan-valley', 'central-luzon', 'calabarzon', 'mimaropa',
    'bicol', 'western-visayas', 'nir', 'central-visayas', 'eastern-visayas', 'zamboanga',
    'northern-mindanao', 'davao', 'soccsksargen', 'caraga', 'barmm'
  ]::text[]),
  add constraint opportunities_course_groups_known check (course_groups <@ array[
    'it_cs', 'engineering', 'health', 'education', 'business',
    'arts_humanities', 'sciences', 'agriculture', 'other'
  ]::text[]),
  add constraint opportunities_year_levels_known check (year_levels <@ array[
    '1', '2', '3', '4', '5', 'graduating'
  ]::text[]);

-- Same columns as before, with the audience columns added at the end.
create or replace view public.public_opportunities as
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
  o.updated_at,
  o.regions,
  o.course_groups,
  o.year_levels
from public.opportunities o
join public.categories c on c.id = o.category_id
where o.status in ('published', 'expired');

revoke all on public.public_opportunities from anon, authenticated;
grant select on public.public_opportunities to anon, authenticated;
