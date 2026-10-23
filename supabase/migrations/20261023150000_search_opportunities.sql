-- Public listing search: full-text (simple config, works for Taglish) plus
-- trigram similarity for typos and partial words ("schlarship", "DOST").
-- Runs as the caller and reads only the public view, so it can't expose drafts
-- or internal columns.
create or replace function public.search_opportunities(q text)
returns setof public.public_opportunities
language sql
stable
set search_path = ''
as $$
  select p.*
  from public.public_opportunities p
  where p.status = 'published'
    and (
      p.search_vector @@ websearch_to_tsquery('simple'::regconfig, q)
      or extensions.word_similarity(lower(q), lower(p.title)) > 0.45
      or extensions.word_similarity(lower(q), lower(p.organization)) > 0.45
      or strpos(lower(p.title || ' ' || p.organization), lower(q)) > 0
    )
  order by
    greatest(
      ts_rank(p.search_vector, websearch_to_tsquery('simple'::regconfig, q)),
      extensions.word_similarity(lower(q), lower(p.title)),
      extensions.word_similarity(lower(q), lower(p.organization))
    ) desc
  limit 100;
$$;

grant execute on function public.search_opportunities(text) to anon, authenticated;
