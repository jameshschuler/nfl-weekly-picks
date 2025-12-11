import { useSuspenseQuery } from "@tanstack/react-query";
import { scheduleQueryOptions } from "~/utils/leagues";
import { Matchup } from "./Matchup";

interface PicksTabProps {
  week: string;
}

export function PicksTab({ week }: PicksTabProps) {
  const { data, error } = useSuspenseQuery(scheduleQueryOptions(week));
  const { matchups, isLocked, currentWeek } = data;

  return (
    <div className="flex flex-col gap-4 mt-4">
      {matchups.map((matchup) => {
        return (
          <Matchup key={matchup.id} isLocked={isLocked} matchup={matchup} />
        );
      })}
    </div>
  );
}
