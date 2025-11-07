alter table "nflweeklypicks"."teams" add column "alternate_color" text;

alter table "nflweeklypicks"."teams" add column "color" text not null;

alter table "nflweeklypicks"."teams" add column "created_at" timestamp with time zone not null default now();

alter table "nflweeklypicks"."teams" add column "logos" jsonb;

alter table "nflweeklypicks"."teams" add column "updated_at" timestamp with time zone;

grant delete on table "nflweeklypicks"."seasons" to "anon";

grant insert on table "nflweeklypicks"."seasons" to "anon";

grant references on table "nflweeklypicks"."seasons" to "anon";

grant select on table "nflweeklypicks"."seasons" to "anon";

grant trigger on table "nflweeklypicks"."seasons" to "anon";

grant truncate on table "nflweeklypicks"."seasons" to "anon";

grant update on table "nflweeklypicks"."seasons" to "anon";

grant delete on table "nflweeklypicks"."seasons" to "authenticated";

grant insert on table "nflweeklypicks"."seasons" to "authenticated";

grant references on table "nflweeklypicks"."seasons" to "authenticated";

grant select on table "nflweeklypicks"."seasons" to "authenticated";

grant trigger on table "nflweeklypicks"."seasons" to "authenticated";

grant truncate on table "nflweeklypicks"."seasons" to "authenticated";

grant update on table "nflweeklypicks"."seasons" to "authenticated";

grant delete on table "nflweeklypicks"."seasons" to "service_role";

grant insert on table "nflweeklypicks"."seasons" to "service_role";

grant references on table "nflweeklypicks"."seasons" to "service_role";

grant select on table "nflweeklypicks"."seasons" to "service_role";

grant trigger on table "nflweeklypicks"."seasons" to "service_role";

grant truncate on table "nflweeklypicks"."seasons" to "service_role";

grant update on table "nflweeklypicks"."seasons" to "service_role";

grant delete on table "nflweeklypicks"."teams" to "anon";

grant insert on table "nflweeklypicks"."teams" to "anon";

grant references on table "nflweeklypicks"."teams" to "anon";

grant select on table "nflweeklypicks"."teams" to "anon";

grant trigger on table "nflweeklypicks"."teams" to "anon";

grant truncate on table "nflweeklypicks"."teams" to "anon";

grant update on table "nflweeklypicks"."teams" to "anon";

grant delete on table "nflweeklypicks"."teams" to "authenticated";

grant insert on table "nflweeklypicks"."teams" to "authenticated";

grant references on table "nflweeklypicks"."teams" to "authenticated";

grant select on table "nflweeklypicks"."teams" to "authenticated";

grant trigger on table "nflweeklypicks"."teams" to "authenticated";

grant truncate on table "nflweeklypicks"."teams" to "authenticated";

grant update on table "nflweeklypicks"."teams" to "authenticated";

grant delete on table "nflweeklypicks"."teams" to "service_role";

grant insert on table "nflweeklypicks"."teams" to "service_role";

grant references on table "nflweeklypicks"."teams" to "service_role";

grant select on table "nflweeklypicks"."teams" to "service_role";

grant trigger on table "nflweeklypicks"."teams" to "service_role";

grant truncate on table "nflweeklypicks"."teams" to "service_role";

grant update on table "nflweeklypicks"."teams" to "service_role";


