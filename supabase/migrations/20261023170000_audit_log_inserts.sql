-- Curators write their own audit entries from server actions (as themselves,
-- not with the secret key), so actor_id must be the signed-in user.
create policy "Curators add their own audit entries"
  on public.audit_logs for insert to authenticated
  with check ((select public.is_curator()) and actor_id = (select auth.uid()));
