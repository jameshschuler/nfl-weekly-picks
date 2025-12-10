import { useMemo } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "./ui/item";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { Button } from "./ui/button";

interface MatchupProps {
  schedule: { id: string; name: string; shortName: string; startDate: string };
  isLocked: boolean;
}

export function Matchup({ schedule, isLocked }: MatchupProps) {
  const [awayTeam, homeTeam] = useMemo(() => {
    const [away, home] = schedule.name.split("at");
    const [shortAway, shortHome] = schedule.shortName.split("@");

    return [
      `${away.trim()} (${shortAway.trim()})`,
      `${home.trim()} (${shortHome.trim()})`,
    ];
  }, [schedule]);

  return (
    <Item variant="outline" key={schedule.id}>
      <ItemContent>
        <ItemTitle className="flex flex-col items-start">
          <div className="flex">
            <p>{awayTeam}</p>
          </div>
          <div className="flex">
            <p>{homeTeam}</p>
          </div>
        </ItemTitle>
        <ItemDescription>
          {/* TODO: display day of the week */}
          {dayjs(schedule.startDate).format("MMMM D, YYYY @ h:mm A")}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="sm">
          {isLocked && <FontAwesomeIcon icon={faLock} />}
        </Button>
      </ItemActions>
    </Item>
  );
}
