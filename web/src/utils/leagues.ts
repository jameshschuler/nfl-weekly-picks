import { notFound, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getServiceSupabaseClient, getSupabaseServerClient } from "./supabase";
import camelcaseKeys from "camelcase-keys";
import { queryOptions } from "@tanstack/react-query";
import dayjs from "dayjs";

interface Event {
  id: string;
  competitions: {
    competitors: {
      //
      team: {
        id: string; // external team ID
      };
      winner: boolean;
      homeAway: "home" | "away";
      record: {
        displayValue: string;
      };
      score: {
        value: number;
      };
    }[];
    status: {
      type: {
        name: string; // STATUS_IN_PROGRESS, STATUS_FINAL
        completed: boolean;
      };
    };
  }[];
}

async function fetchAndStoreMatchupMetadata(week: number) {
  console.log("Fetching and storing matchup metadata...");
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
    const events = data.events as Event[];

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
        home_team_score: homeTeam.score.value ?? 0,
        away_team_score: awayTeam.score.value ?? 0,
        winning_team_id: winningTeamId,
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

  // TODO: How should errors be handled here?
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
  .inputValidator((d: string) => d)
  .handler(async ({ data: leagueId }) => {
    const supabase = getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // TODO: move to middleware
    if (!user) {
      throw redirect({ to: "/login" });
    }

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

    // TODO: How should errors be handled here?
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

export const fetchSchedule = createServerFn({ method: "GET" })
  .inputValidator((d: string) => {
    const week = parseInt(d, 10);
    if (isNaN(week) || week < 1 || week > 18) {
      throw new Error("Week must be a number between 1 and 18.");
    }
    return week;
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
      .select("id, name, short_name, start_date")
      .eq("season", "2025") // TODO: take as a parameter
      .eq("week", week)
      .order("start_date", { ascending: true });

    if (error) {
      throw new Error("Error fetching schedule data.");
    }

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
      // TODO: season is not active, so league is locked skip over fetching
      isLocked = true;
    }

    const matchupData = await fetchAndStoreMatchupMetadata(week);
    const matchupDataMap = new Map<string, any>(
      (matchupData ?? []).map((item) => [item.id, item])
    );

    const { data: weeklySchedule } = await supabase
      .schema("nflweeklypicks")
      .from("weekly_schedules")
      .select("id, value, start_date, end_date")
      .lte("start_date", now)
      .gte("end_date", now)
      .single();

    if (!weeklySchedule) {
      isLocked = true;
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
      ? dayjs(now).isAfter(
          dayjs(weeklySchedule.start_date).subtract(18, "hour")
        )
      : false;

    const isCurrentWeek = weeklySchedule
      ? Number(weeklySchedule.value) === week
      : false;

    console.log(
      "Is after start date of the week with offset?",
      isAfterStartDate
    );
    console.log("Is before first game of the week?", isBeforeFirstGame);
    console.log("Is current week?", isCurrentWeek);

    isLocked =
      !weeklySchedule ||
      !isCurrentWeek ||
      !isAfterStartDate ||
      !isBeforeFirstGame;

    console.log("Is league locked for picking?", isLocked);

    return {
      matchups: camelcaseKeys(weeklyMatchups, { deep: true }),
      matchupData: camelcaseKeys(matchupDataMap, { deep: true }),
      isLocked,
      currentWeek: weeklySchedule?.value ?? null,
    };
  });

export const scheduleQueryOptions = (week: string) =>
  queryOptions({
    queryKey: ["schedule", week],
    queryFn: () => fetchSchedule({ data: week }),
  });
