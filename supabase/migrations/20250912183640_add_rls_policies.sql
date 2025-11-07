drop policy "Enable read access for all users" on "nflweeklypicks"."teams";

create policy "auth_users_read_only"
on "nflweeklypicks"."seasons"
as permissive
for select
to authenticated
using (true);


create policy "service_role_all_access"
on "nflweeklypicks"."seasons"
as permissive
for all
to service_role
using (true)
with check (true);


create policy "auth_users_read_only"
on "nflweeklypicks"."teams"
as permissive
for select
to authenticated
using (true);


create policy "service_role_all_access"
on "nflweeklypicks"."teams"
as permissive
for all
to service_role
using (true)
with check (true);



