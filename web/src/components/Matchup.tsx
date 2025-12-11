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
import { MatchData } from "~/utils/leagues";

interface MatchupProps {
  matchup: MatchData["matchups"][number];
  isLocked: boolean;
}

export function Matchup({ matchup, isLocked }: MatchupProps) {
  const [awayTeam, homeTeam] = matchup.name.split("at").map((s) => s.trim());

  return (
    <Item variant="outline" key={matchup.id}>
      <ItemContent>
        <ItemTitle className="flex w-full">
          <div className="flex flex-col w-1/2">
            <div className="flex justify-between w-full items-center">
              <div className="flex gap-2">
                <p>{awayTeam}</p>
                <p className="text-muted-foreground">
                  {matchup.metadata?.awayTeamRecord}
                </p>
              </div>
              <p>{matchup.metadata?.awayTeamScore}</p>
            </div>
            <div className="flex justify-between w-full items-center">
              <div className="flex gap-2">
                <p>{homeTeam}</p>
                <p className="text-muted-foreground">
                  {matchup.metadata?.homeTeamRecord}
                </p>
              </div>
              <p>{matchup.metadata?.homeTeamScore}</p>
            </div>
          </div>
          <div className="flex w-1/2 justify-center">
            {matchup.metadata?.eventStatus === "STATUS_FINAL" && (
              <p className="font-semibold">Final</p>
            )}
            {matchup.metadata?.eventStatus === "STATUS_IN_PROGRESS" && (
              <p>In Progress</p>
            )}
            {matchup.metadata?.eventStatus === "STATUS_SCHEDULED" && (
              <p>{dayjs(matchup.startDate).format("dddd, MMMM D @ h:mm A")}</p>
            )}
          </div>
        </ItemTitle>
        {/* <ItemDescription>
        </ItemDescription> */}
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="sm">
          {isLocked && <FontAwesomeIcon icon={faLock} />}
        </Button>
      </ItemActions>
    </Item>
  );
}
