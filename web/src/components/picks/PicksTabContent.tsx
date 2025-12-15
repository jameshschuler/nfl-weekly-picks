import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { savePicks, scheduleQueryOptions } from "~/utils/leagues";
import { Matchup } from "./Matchup";
import { useState } from "react";
import { Button } from "../ui/button";
import { useParams } from "@tanstack/react-router";

interface PicksTabContentProps {
  week: string;
}

export function PicksTabContent({ week }: PicksTabContentProps) {
  const { data, error: fetchScheduleError } = useSuspenseQuery(
    scheduleQueryOptions(week)
  );

  const { matchups, isLocked } = data;
  const { leagueId } = useParams({ strict: false });

  const { mutateAsync: savePicksAsync, isPending } = useMutation({
    mutationFn: savePicks,
    onSuccess: () => {
      // TODO:
    },
    onError: (error) => {
      console.log("Error saving picks:", error);
    },
  });

  const [picks, setPicks] = useState<Map<number, number>>(new Map());

  function onPickSelected(matchupId: number, teamId: number | null) {
    setPicks((prev) => {
      const newPicks = new Map(prev);
      if (teamId === null) {
        newPicks.delete(matchupId);
      } else {
        newPicks.set(matchupId, teamId);
      }
      return newPicks;
    });
  }

  async function handleSavePicks() {
    try {
      const insertedPicksResponse = await savePicksAsync({
        data: {
          week: Number(week),
          picks: Object.fromEntries(picks),
          leagueId: Number(leagueId),
        },
      });

      const newPicks = new Map(
        (insertedPicksResponse.data ?? []).map((pick) => [
          pick.matchup_id,
          pick.team_id,
        ])
      );

      setPicks(newPicks);
    } catch (error) {
      console.log("Error saving picks:", error);
    }
  }

  if (fetchScheduleError) {
    // TODO:
  }

  return (
    <div>
      <div className="flex justify-end">
        {picks.size > 0 && (
          <Button onClick={handleSavePicks}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {matchups.map((matchup) => {
          return (
            <Matchup
              key={matchup.id}
              isLocked={false}
              matchup={matchup}
              selectedTeamId={matchup.pick?.teamId ?? null}
              onPickSelected={onPickSelected}
            />
          );
        })}
      </div>
    </div>
  );
}
