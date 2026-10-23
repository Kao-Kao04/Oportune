-- The variable name clashed with the window_start column ("ambiguous").
create or replace function public.hit_rate_limit(limit_key text, window_seconds int, max_hits int)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_window timestamptz := to_timestamp(floor(extract(epoch from now()) / window_seconds) * window_seconds);
  hits int;
begin
  insert into public.rate_limits as r (key, window_start, count)
  values (limit_key, current_window, 1)
  on conflict (key, window_start) do update set count = r.count + 1
  returning r.count into hits;
  return hits <= max_hits;
end;
$$;

revoke execute on function public.hit_rate_limit(text, int, int) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, int, int) to service_role;
