CREATE ROLE nflweeklypicks_job_role;
GRANT ALL PRIVILEGES ON TABLE nflweeklypicks.weekly_matchup_metadatas TO nflweeklypicks_job_role;
GRANT ALL PRIVILEGES ON TABLE nflweeklypicks.weekly_results TO nflweeklypicks_job_role;
GRANT ALL PRIVILEGES ON TABLE nflweeklypicks.user_weekly_results TO nflweeklypicks_job_role;