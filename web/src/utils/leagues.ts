import { notFound, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getServiceSupabaseClient, getSupabaseServerClient } from "./supabase";
import camelcaseKeys from "camelcase-keys";
import { queryOptions } from "@tanstack/react-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ExternalEvent } from "~/types";
import { z } from "zod";
import { LeagueIdSchema, PicksSchema, WeekSchema } from "./schemas";
import { Database } from "types/supabase";

dayjs.extend(utc);
// TODO: error handling/logging

async function fetchAndStoreMatchupMetadata(week: string) {
  const supabase = getServiceSupabaseClient();

  const { data: weekMatchupMetadata, error } = await supabase
    .schema("nflweeklypicks")
    .from("weekly_matchup_metadatas")
    .select("*")
    .eq("season", "2025")
    .eq("week", week);

  if (error) {
    console.error("Error checking existing matchup metadata:", error);
    return;
  }

  if (weekMatchupMetadata.length > 0) {
    // if week is active, should cache and refresh every 15 minutes? TODO: implement caching strategy
    // TODO: if week is active, consider refreshing data
    return weekMatchupMetadata;
  }

  try {
    const response = await fetch(
      `https://partners.api.espn.com/v2/sports/football/nfl/events?dates=2025&limit=1000&week=${week}`
    );
    const data = await response.json();
    const events = data.events as ExternalEvent[];

    const eventsToInsert = events.map((event) => {
      const comp = event.competitions[0];

      const winningTeamId = comp.status.type.completed
        ? comp.competitors.find((c) => c.winner)?.team.id
        : undefined;

      const homeTeam = comp.competitors.find((c) => c.homeAway === "home")!;
      const awayTeam = comp.competitors.find((c) => c.homeAway === "away")!;

      return {
        season: "2025",
        week,
        external_event_id: event.id,
        home_team_score: homeTeam.score.value,
        away_team_score: awayTeam.score.value,
        home_team_external_id: homeTeam.team.id,
        away_team_external_id: awayTeam.team.id,
        winning_team_id: winningTeamId ? Number(winningTeamId) : null,
        home_team_record: homeTeam.record.displayValue,
        away_team_record: awayTeam.record.displayValue,
        event_status: comp.status.type.name,
      };
    });

    const { data: insertedData, error: insertError } = await supabase
      .schema("nflweeklypicks")
      .from("weekly_matchup_metadatas")
      .insert(eventsToInsert)
      .select();

    if (insertError) {
      console.error("Error inserting matchup metadata:", insertError);
      return;
    }

    return insertedData;
  } catch (err) {
    console.error("Error fetching/storing matchup metadata:", err);
    return;
  }
}

export const fetchLeagues = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect({ to: "/login" });
  }

  const { data: userLeagues, error } = await supabase
    .schema("nflweeklypicks")
    .from("league_users")
    .select(
      `
    leagues (
      id,
      name,
      slug,
      is_system_default,
      created_by,
      user_count:league_users(count)
    )`
    )
    .eq("user_id", user.id);

  if (error) {
    throw new Error("Error fetching leagues.");
  }

  const allLeagues = userLeagues.map((lu) => {
    const league = Array.isArray(lu.leagues) ? lu.leagues[0] : lu.leagues;

    return {
      ...league,
      user_count: league.user_count[0].count,
    };
  });

  const defaultLeague = allLeagues.find((l) => l.is_system_default) || null;
  const leagues = allLeagues.filter((l) => !l.is_system_default);

  return camelcaseKeys(
    {
      defaultLeague,
      leagues,
    },
    { deep: true }
  );
});

export const fetchLeague = createServerFn({ method: "GET" })
  .inputValidator(LeagueIdSchema)
  .handler(async ({ data: leagueId }) => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // TODO: move to middleware
    if (!user) {
      throw redirect({ to: "/login" });
    }

    // TODO: move to a validation function
    const { data, error } = await supabase
      .schema("nflweeklypicks")
      .from("league_users")
      .select(
        `
    leagues (
      id,
      name,
      slug,
      is_system_default,
      created_by,
      user_count:league_users(count)
    )`
      )
      .eq("user_id", user.id)
      .eq("league_id", leagueId)
      .single();

    if (error) {
      throw new Error("Error fetching league data.");
    }

    if (
      !data.leagues ||
      (Array.isArray(data.leagues) && data.leagues.length === 0)
    ) {
      throw notFound();
    }

    const league = Array.isArray(data.leagues) ? data.leagues[0] : data.leagues;

    const now = dayjs().toISOString();
    const { data: weeklySchedule } = await supabase
      .schema("nflweeklypicks")
      .from("weekly_schedules")
      .select("id, value, start_date, end_date")
      .lte("start_date", now)
      .gte("end_date", now)
      .single();

    const currentWeek = weeklySchedule ? weeklySchedule.value : "1";

    return {
      league: camelcaseKeys(league, { deep: true }),
      currentWeek,
    };
  });

async function checkIfLeagueIsLocked(
  week: string
): Promise<{ isLocked: boolean; currentWeek?: string }> {
  const supabase = getSupabaseServerClient();
  let isLocked = false;
  const now = dayjs().toISOString();

  const { data: season } = await supabase
    .schema("nflweeklypicks")
    .from("seasons")
    .select("id")
    .lte("start_date", now)
    .gte("end_date", now)
    .single();

  if (!season) {
    return { isLocked: true };
  }

  const { data: weeklySchedule } = await supabase
    .schema("nflweeklypicks")
    .from("weekly_schedules")
    .select("id, value, start_date, end_date")
    .lte("start_date", now)
    .gte("end_date", now)
    .single();

  if (!weeklySchedule) {
    return { isLocked: true, currentWeek: "1" };
  }

  const { data: firstGame } = await supabase
    .schema("nflweeklypicks")
    .from("weekly_matchups")
    .select("id, start_date")
    .eq("season", "2025")
    .eq("week", week)
    .order("start_date", { ascending: true })
    .limit(1)
    .single();

  const isBeforeFirstGame = firstGame
    ? dayjs(now).isBefore(dayjs(firstGame.start_date))
    : false;

  const isAfterStartDate = weeklySchedule
    ? dayjs(now).isAfter(dayjs(weeklySchedule.start_date).subtract(18, "hour"))
    : false;

  const isCurrentWeek = weeklySchedule ? weeklySchedule.value === week : false;

  console.log("Is after start date of the week with offset?", isAfterStartDate);
  console.log("Is before first game of the week?", isBeforeFirstGame);
  console.log("Is current week?", isCurrentWeek);

  isLocked =
    !weeklySchedule ||
    !isCurrentWeek ||
    !isAfterStartDate ||
    !isBeforeFirstGame;

  console.log("Is league locked for picking?", isLocked);
  return { isLocked, currentWeek: weeklySchedule.value };
}

export const fetchSchedule = createServerFn({ method: "GET" })
  .inputValidator((d: string) => {
    const week = parseInt(d, 10);
    if (isNaN(week) || week < 1 || week > 18) {
      throw new Error("Week must be a number between 1 and 18.");
    }
    return d;
  })
  .handler(async ({ data: week }) => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // TODO: move to middleware
    if (!user) {
      throw redirect({ to: "/login" });
    }

    const { data: weeklyMatchups, error } = await supabase
      .schema("nflweeklypicks")
      .from("weekly_matchups")
      .select(
        "id, name, short_name, start_date, external_id, home_team_id, away_team_id"
      )
      .eq("season", "2025") // TODO: take as a parameter
      .eq("week", week)
      .order("start_date", { ascending: true });

    if (error) {
      throw new Error("Error fetching schedule data.");
    }

    const { data: existingPicks, error: picksError } = await supabase
      .schema("nflweeklypicks")
      .from("picks")
      .select("*")
      .eq("user_id", user.id)
      .eq("week", week)
      .eq("season", "2025");

    if (picksError) {
      throw new Error("Error fetching existing picks.");
    }

    const existingPicksMap = new Map(
      existingPicks.map((pick) => [
        pick.external_event_id,
        { matchupId: pick.matchup_id, teamId: pick.team_id },
      ])
    );

    const matchups = await fetchAndStoreMatchupMetadata(week);
    const matchupByExternalId = new Map(
      (matchups ?? []).map((item) => [item.external_event_id, item])
    );

    const matchupsWithMetadata = weeklyMatchups.map((matchup) => {
      const metadata = matchupByExternalId.get(matchup.external_id);
      const existingPick = existingPicksMap.get(matchup.external_id);

      return {
        ...matchup,
        metadata,
        pick: existingPick,
      };
    });

    const { isLocked, currentWeek } = await checkIfLeagueIsLocked(week);

    return {
      matchups: camelcaseKeys(matchupsWithMetadata, { deep: true }),
      isLocked,
      currentWeek,
    };
  });

type InsertPicks = Database["nflweeklypicks"]["Tables"]["picks"]["Insert"];

export const savePicks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      week: WeekSchema,
      leagueId: LeagueIdSchema,
      picks: PicksSchema,
    })
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // TODO: move to middleware
    if (!user) {
      throw redirect({ to: "/login" });
    }

    const { data: leagueUser, error: leagueUserError } = await supabase
      .schema("nflweeklypicks")
      .from("league_users")
      .select("id")
      .eq("league_id", data.leagueId)
      .eq("user_id", user.id);

    if (leagueUserError || !leagueUser) {
      throw new Error("User is not part of the league.");
    }

    const { isLocked, currentWeek } = await checkIfLeagueIsLocked(
      data.week.toString()
    );

    // TODO:
    // if (isLocked || !currentWeek) {
    //   throw new Error("League is locked for picking.");
    // }

    const keys = Object.keys(data.picks);
    const { data: matchupData, error } = await supabase
      .schema("nflweeklypicks")
      .from("weekly_matchups")
      .select("id, home_team_id, away_team_id, external_id")
      .eq("season", "2025")
      .eq("week", data.week.toString())
      .in(
        "id",
        keys.map((k) => Number(k))
      );

    if (error) {
      throw new Error("Error fetching matchup data for picks.");
    }

    const { data: existingPicks, error: existingPicksError } = await supabase
      .schema("nflweeklypicks")
      .from("picks")
      .select("*")
      .eq("user_id", user.id)
      .eq("league_id", data.leagueId)
      .eq("week", data.week.toString())
      .eq("season", "2025");

    if (existingPicksError) {
      throw new Error("Error fetching existing picks.");
    }

    const existingPicksKeys = new Map(
      existingPicks.map((pick) => [pick.matchup_id, pick])
    );
    const picks = new Array<InsertPicks>();
    matchupData?.forEach((matchup) => {
      const pickedTeamId = data.picks[matchup.id];
      if (
        pickedTeamId !== null &&
        pickedTeamId !== matchup.home_team_id &&
        pickedTeamId !== matchup.away_team_id
      ) {
        throw new Error(
          `Invalid team ID ${pickedTeamId} for matchup ${matchup.id}.`
        );
      }

      let pick: InsertPicks | null = null;
      if (existingPicksKeys.has(matchup.id)) {
        pick = {
          ...existingPicksKeys.get(matchup.id)!,
          team_id: pickedTeamId,
          updated_at: dayjs.utc().format(),
        };
      } else {
        pick = {
          league_id: data.leagueId,
          user_id: user.id,
          week: data.week.toString(),
          season: "2025",
          team_id: pickedTeamId,
          tie_breaker_score: null,
          matchup_id: matchup.id,
          external_event_id: matchup.external_id,
        };
      }

      picks.push(pick);
    });

    const { data: insertedPicks } = await supabase
      .schema("nflweeklypicks")
      .from("picks")
      .upsert(picks)
      .select();

    return { success: true, data: insertedPicks };
  });

export type MatchData = Awaited<ReturnType<typeof fetchSchedule>>;

export const scheduleQueryOptions = (week: string) =>
  queryOptions({
    queryKey: ["schedule", week],
    queryFn: () => fetchSchedule({ data: week }),
  });
