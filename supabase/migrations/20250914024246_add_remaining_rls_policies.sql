create policy "Allow authenticated users to read all rows"
on "nflweeklypicks"."weekly_matchup_metadatas"
as permissive
for select
to authenticated
using (true);


create policy "Allow nflweeklypicks_job_role to create rows"
on "nflweeklypicks"."weekly_matchup_metadatas"
as permissive
for insert
to nflweeklypicks_job_role
with check (true);


create policy "Allow nflweeklypicks_job_role to delete rows"
on "nflweeklypicks"."weekly_matchup_metadatas"
as permissive
for delete
to public
using (true);


create policy "Allow nflweeklypicks_job_role to update rows"
on "nflweeklypicks"."weekly_matchup_metadatas"
as permissive
for update
to nflweeklypicks_job_role
using (true)
with check (true);


create policy "Allow authenticated users to read all rows"
on "nflweeklypicks"."weekly_results"
as permissive
for select
to authenticated
using (true);


create policy "Allow nflweeklypicks_job_role to create rows"
on "nflweeklypicks"."weekly_results"
as permissive
for insert
to nflweeklypicks_job_role
with check (true);


create policy "Allow nflweeklypicks_job_role to delete rows"
on "nflweeklypicks"."weekly_results"
as permissive
for delete
to public
using (true);


create policy "Allow nflweeklypicks_job_role to update rows"
on "nflweeklypicks"."weekly_results"
as permissive
for update
to nflweeklypicks_job_role
using (true)
with check (true);



