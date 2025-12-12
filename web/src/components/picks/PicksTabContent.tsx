import { useSuspenseQuery } from "@tanstack/react-query";
import { scheduleQueryOptions } from "~/utils/leagues";
import { Matchup } from "./Matchup";
import { useState } from "react";
import { Button } from "../ui/button";

interface PicksTabContentProps {
  week: string;
}

export function PicksTabContent({ week }: PicksTabContentProps) {
  const { data, error } = useSuspenseQuery(scheduleQueryOptions(week));
  const { matchups, isLocked } = data;

  // Need to add matchupId and external event id to picks table
  // TODO: handle error

  const [picks, setPicks] = useState<Map<number, number | null>>(new Map());

  function onPickSelected(matchupId: number, teamId: number | null) {
    setPicks((prev) => {
      const newPicks = new Map(prev);
      newPicks.set(matchupId, teamId);
      return newPicks;
    });
  }

  console.log(picks.size);

  return (
    <div>
      <div className="flex justify-end">
        {picks.size > 0 && <Button>Save</Button>}
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {matchups.map((matchup) => {
          return (
            <Matchup
              key={matchup.id}
              isLocked={false}
              matchup={matchup}
              // selectedTeamId={picks.get(matchup.id) ?? null}
              onPickSelected={onPickSelected}
            />
          );
        })}
      </div>
    </div>
  );
}
