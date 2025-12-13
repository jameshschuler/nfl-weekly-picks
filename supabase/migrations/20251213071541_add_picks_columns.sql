alter table "nflweeklypicks"."picks" add column "external_event_id" text not null;

alter table "nflweeklypicks"."picks" add column "matchup_id" bigint not null;

alter table "nflweeklypicks"."picks" add constraint "picks_matchup_id_fkey" FOREIGN KEY (matchup_id) REFERENCES nflweeklypicks.weekly_matchups(id) not valid;

alter table "nflweeklypicks"."picks" validate constraint "picks_matchup_id_fkey";


