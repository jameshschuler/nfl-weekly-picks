import { notFound, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "./supabase";
import camelcaseKeys from "camelcase-keys";
import { queryOptions } from "@tanstack/react-query";

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

    return camelcaseKeys(league, { deep: true });
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

    const { data, error } = await supabase
      .schema("nflweeklypicks")
      .from("weekly_matchups")
      .select("id, name, short_name, start_date")
      .eq("season", "2025") // TODO: take as a parameter
      .eq("week", week);

    if (error) {
      throw new Error("Error fetching schedule data.");
    }

    // TODO: get current nfl week

    return data;
  });

export const scheduleQueryOptions = (week: string) =>
  queryOptions({
    queryKey: ["schedule", week],
    queryFn: () => fetchSchedule({ data: week }),
  });
