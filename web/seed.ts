import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL environment variable");
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  db: {
    schema: "nflweeklypicks",
  },
});

// Record ref http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2025/types/2/teams/22/record?lang=en&region=us

async function seedTeamData() {
  const { error: deleteError } = await supabase
    .schema("nflweeklypicks")
    .from("teams")
    .delete()
    .neq("id", 0);

  if (deleteError) {
    console.error("Error deleting existing teams:", deleteError);
  } else {
    console.log("Existing teams deleted");
  }

  const response = await fetch(
    "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/teams?limit=32"
  );
  const data = await response.json();
  const teams = data.items;

  teams.forEach(async (teamRef: { $ref: string }) => {
    const teamResponse = await fetch(teamRef["$ref"]);
    const teamData = await teamResponse.json();

    const {
      id,
      displayName,
      color,
      alternateColor,
      logos,
      abbreviation,
      slug,
    } = teamData;

    const { data: insertedTeam, error } = await supabase
      .schema("nflweeklypicks")
      .from("teams")
      .insert([
        {
          external_id: id,
          name: displayName,
          color,
          alternate_color: alternateColor,
          logos,
          abbreviation,
          slug,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(`Error inserting team ${displayName}:`, error);
    } else {
      console.log("Inserted team:", insertedTeam.name);
    }
  });
}

async function seedSeasonData() {
  const currentYear = new Date().getFullYear();
  const response = await fetch(
    `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${currentYear}&seasontype=2`
  );
  const data = await response.json();
  const season = data.leagues[0].season;

  const { error: deleteError } = await supabase
    .schema("nflweeklypicks")
    .from("seasons")
    .delete()
    .neq("id", 0);

  if (deleteError) {
    console.error("Error deleting existing seasons:", deleteError);
  } else {
    console.log("Existing seasons deleted");
  }

  const { data: insertedSeason, error } = await supabase
    .schema("nflweeklypicks")
    .from("seasons")
    .insert([
      {
        year: season.year,
        type: season.type.type,
        start_date: season.startDate,
        end_date: season.endDate,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error inserting season:", error);
  } else {
    console.log("Inserted season:", insertedSeason);
  }
}

async function seedWeeklySchedulesData() {
  const { data: seasons, error: seasonsError } = await supabase
    .schema("nflweeklypicks")
    .from("seasons")
    .select();

  if (seasonsError) {
    console.error("Error fetching seasons:", seasonsError);
    return;
  }

  for (const season of seasons) {
    const { error: deleteError } = await supabase
      .schema("nflweeklypicks")
      .from("weekly_schedules")
      .delete()
      .neq("id", 0)
      .eq("year", season.year);

    if (deleteError) {
      console.error("Error deleting existing weekly schedules:", deleteError);
    } else {
      console.log("Existing weekly schedules deleted for season:", season.year);
    }

    const { error: deleteMatchupsError } = await supabase
      .schema("nflweeklypicks")
      .from("weekly_matchups")
      .delete()
      .neq("id", 0)
      .eq("season", season.year);

    if (deleteMatchupsError) {
      console.error(
        "Error deleting existing weekly matchups:",
        deleteMatchupsError
      );
    } else {
      console.log("Existing weekly matchups deleted for season:", season.year);
    }

    const getWeeksRequests = seasons.map((season) =>
      fetch(
        `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${season.year}/types/2/weeks?lang=en&region=us`
      )
    );
    const getWeeksResponse = await Promise.all(getWeeksRequests);
    const weeksData = await Promise.all(
      getWeeksResponse.map((res) => res.json())
    );

    const getWeekDataRequests = weeksData
      .map((data) => {
        return data.items.map((weekRef: { $ref: string }) =>
          fetch(weekRef["$ref"])
        );
      })
      .flat();
    const getWeekDataResponse = await Promise.all(getWeekDataRequests);
    const weeksDetailedData = await Promise.all(
      getWeekDataResponse.map((res) => res.json())
    );

    for (const week of weeksDetailedData) {
      const { data: insertedWeek, error } = await supabase
        .schema("nflweeklypicks")
        .from("weekly_schedules")
        .insert([
          {
            year: season.year,
            start_date: week.startDate,
            end_date: week.endDate,
            value: week.number.toString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error(
          `Error inserting week ${week.number} for season ${season.year}:`,
          error
        );
      } else {
        console.log(
          "Inserted week:",
          insertedWeek.value,
          "for season:",
          season.year
        );
      }

      const eventsRef = week.events.$ref;
      const eventsResponse = await fetch(eventsRef);
      const eventsData = await eventsResponse.json();

      const getEventRequests = eventsData.items.map((evt: { $ref: string }) => {
        return fetch(evt.$ref);
      });
      const getEventResponses = await Promise.all(getEventRequests);
      const eventData = await Promise.all(
        getEventResponses.map((res) => res.json())
      );

      for (const event of eventData) {
        const competitions = event.competitions[0];
        const [team1, team2] = competitions.competitors;

        let homeTeamId, awayTeamId;
        if (team1.homeAway === "home") {
          homeTeamId = team1.id;
          awayTeamId = team2.id;
        } else {
          homeTeamId = team2.id;
          awayTeamId = team1.id;
        }

        const { data: insertedEvent, error } = await supabase
          .schema("nflweeklypicks")
          .from("weekly_matchups")
          .insert([
            {
              name: event.name,
              short_name: event.shortName,
              start_date: event.date,
              week: week.number,
              season: season.year,
              home_team_id: homeTeamId,
              away_team_id: awayTeamId,
              external_id: event.id,
            },
          ])
          .select()
          .single();

        if (error) {
          console.error(
            `Error inserting event ${event.id} for week ${week.number} of season ${season.year}:`,
            error
          );
        } else {
          console.log(
            "Inserted event:",
            insertedEvent.name,
            "for week:",
            week.number,
            "of season:",
            season.year
          );
        }
      }
    }
  }
}

async function main() {
  await seedTeamData();
  await seedSeasonData();
  await seedWeeklySchedulesData();
}

main()
  .then(() => {
    console.log("Seeding complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding data:", error);
    process.exit(1);
  });
