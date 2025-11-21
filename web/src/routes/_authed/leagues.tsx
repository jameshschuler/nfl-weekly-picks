import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "~/utils/supabase";
import camelcaseKeys from "camelcase-keys";

const fetchLeagues = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated for this action.");
  }

  const { data: userLeagues, error } = await supabase
    .schema("nflweeklypicks")
    .from("league_users")
    .select(
      `
    league:leagues (
      id,
      name,
      is_system_default,
      user_count:league_users(count)
    )`
    )
    .eq("user_id", user.id);

  // TODO: How should errors be handled here?
  if (error) {
    throw notFound();
  }

  const allLeagues = userLeagues.map((lu) => {
    const league = Array.isArray(lu.league) ? lu.league[0] : lu.league;

    return {
      ...league,
      user_count: league.user_count.length,
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

export const Route = createFileRoute("/_authed/leagues")({
  component: RouteComponent,
  loader: () => {
    return fetchLeagues();
  },
});

function RouteComponent() {
  const leagues = Route.useLoaderData();
  const { user } = Route.useRouteContext();
  return (
    <div>
      <div>User email: {user?.email}</div>
      <h1>Leagues</h1>

      <h3>Starter Leagues</h3>
      <p>Content</p>
      <hr />
      <h3>Your Leagues</h3>
      <p>Content</p>
    </div>
  );
}
