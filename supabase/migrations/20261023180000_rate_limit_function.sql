-- Atomic fixed-window rate limit. Returns true if this hit is allowed.
-- Only the server (secret key / service_role) may call it.
create or replace function public.hit_rate_limit(limit_key text, window_seconds int, max_hits int)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  window_start timestamptz := to_timestamp(floor(extract(epoch from now()) / window_seconds) * window_seconds);
  hits int;
begin
  insert into public.rate_limits as r (key, window_start, count)
  values (limit_key, window_start, 1)
  on conflict (key, window_start) do update set count = r.count + 1
  returning r.count into hits;
  return hits <= max_hits;
end;
$$;

revoke execute on function public.hit_rate_limit(text, int, int) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, int, int) to service_role;
