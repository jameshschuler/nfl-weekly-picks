alter table "nflweeklypicks"."weekly_schedules" drop constraint "season_weeks_season_id_fkey";

alter table "nflweeklypicks"."weekly_schedules" drop column "season_id";

alter table "nflweeklypicks"."weekly_schedules" add column "year" text not null;


