create policy "Allow authenticated users to create rows"
on "nflweeklypicks"."league_users"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Allow authenticated users to read all rows"
on "nflweeklypicks"."league_users"
as permissive
for select
to authenticated
using (true);


create policy "Allow users to delete their own rows"
on "nflweeklypicks"."league_users"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Allow users to update their own rows"
on "nflweeklypicks"."league_users"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Allow authenticated users to create rows"
on "nflweeklypicks"."leagues"
as permissive
for insert
to authenticated
with check ((auth.uid() = created_by));


create policy "Allow authenticated users to read all rows"
on "nflweeklypicks"."leagues"
as permissive
for select
to authenticated
using (true);


create policy "Allow users to delete their own rows"
on "nflweeklypicks"."leagues"
as permissive
for delete
to authenticated
using ((auth.uid() = created_by));


create policy "Allow users to update their own rows"
on "nflweeklypicks"."leagues"
as permissive
for update
to authenticated
using ((auth.uid() = created_by))
with check ((auth.uid() = created_by));


create policy "Allow authenticated users to create rows"
on "nflweeklypicks"."picks"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "Allow authenticated users to read all rows"
on "nflweeklypicks"."picks"
as permissive
for select
to authenticated
using (true);


create policy "Allow users to delete their own rows"
on "nflweeklypicks"."picks"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Allow users to update their own rows"
on "nflweeklypicks"."picks"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



