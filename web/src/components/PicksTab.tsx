import { useSuspenseQuery } from "@tanstack/react-query";
import { scheduleQueryOptions } from "~/utils/leagues";
import { Matchup } from "./Matchup";

interface PicksTabProps {
  week: string;
}

export function PicksTab({ week }: PicksTabProps) {
  const { data, error } = useSuspenseQuery(scheduleQueryOptions(week));
  const { matchups, matchupData, isLocked, currentWeek } = data;

  console.log(matchupData);

  return (
    <div className="flex flex-col gap-4 mt-4">
      {matchups.map((schedule) => {
        return (
          <Matchup key={schedule.id} isLocked={isLocked} schedule={schedule} />
        );
      })}
    </div>
  );
}
