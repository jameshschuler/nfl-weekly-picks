alter table "nflweeklypicks"."weekly_matchups" drop constraint "weekly_matchups_away_team_id_fkey";

alter table "nflweeklypicks"."weekly_matchups" drop constraint "weekly_matchups_home_team_id_fkey";

alter table "nflweeklypicks"."weekly_matchups" add constraint "weekly_matchups_away_team_id_fkey" FOREIGN KEY (away_team_id) REFERENCES nflweeklypicks.teams(external_id) not valid;

alter table "nflweeklypicks"."weekly_matchups" validate constraint "weekly_matchups_away_team_id_fkey";

alter table "nflweeklypicks"."weekly_matchups" add constraint "weekly_matchups_home_team_id_fkey" FOREIGN KEY (home_team_id) REFERENCES nflweeklypicks.teams(external_id) not valid;

alter table "nflweeklypicks"."weekly_matchups" validate constraint "weekly_matchups_home_team_id_fkey";


