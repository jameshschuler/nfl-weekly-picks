import { useMemo, useState } from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "../ui/item";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { Button } from "../ui/button";
import { MatchData } from "~/utils/leagues";
import { Checkbox } from "../ui/checkbox";

interface MatchupProps {
  matchup: MatchData["matchups"][number];
  isLocked: boolean;
  onPickSelected: (matchupId: number, teamId: number | null) => void;
  selectedTeamId?: number | null;
}

export function Matchup({
  matchup,
  isLocked,
  onPickSelected,
  selectedTeamId,
}: MatchupProps) {
  const [awayTeam, homeTeam] = matchup.name.split("at").map((s) => s.trim());
  const [pickedTeamId, setPickedTeamId] = useState<number | null>(
    selectedTeamId ?? null
  );

  function handlePick(teamId: number | null) {
    if (pickedTeamId === teamId) {
      setPickedTeamId(null);
      onPickSelected(matchup.id, null);
      return;
    }
    setPickedTeamId(teamId);
    onPickSelected(matchup.id, teamId);
  }

  return (
    <Item variant="outline" key={matchup.id}>
      <ItemContent>
        <ItemTitle className="flex w-full">
          <div className="flex flex-col w-1/2 gap-3">
            <div className="flex justify-between w-full items-center">
              <div className="flex gap-2 items-center">
                <Checkbox
                  checked={pickedTeamId === matchup.awayTeamId}
                  onClick={() => handlePick(matchup.awayTeamId)}
                  disabled={
                    pickedTeamId !== null && pickedTeamId !== matchup.awayTeamId
                  } //  && isLocked
                />
                <p className="text-base">{awayTeam}</p>
                <p className="text-muted-foreground">
                  {matchup.metadata?.awayTeamRecord}
                </p>
              </div>
              {matchup.metadata?.eventStatus !== "STATUS_SCHEDULED" && (
                <p>{matchup.metadata?.awayTeamScore}</p>
              )}
            </div>
            <div className="flex justify-between w-full items-center">
              <div className="flex gap-2 items-center">
                <Checkbox
                  checked={pickedTeamId === matchup.homeTeamId}
                  onClick={() => handlePick(matchup.homeTeamId)}
                  disabled={
                    pickedTeamId !== null && pickedTeamId !== matchup.homeTeamId
                  } // && isLocked
                />
                <p className="text-base">{homeTeam}</p>
                <p className="text-muted-foreground">
                  {matchup.metadata?.homeTeamRecord}
                </p>
              </div>
              {matchup.metadata?.eventStatus !== "STATUS_SCHEDULED" && (
                <p>{matchup.metadata?.homeTeamScore}</p>
              )}
            </div>
          </div>
          <div className="flex w-1/2 justify-center">
            {matchup.metadata?.eventStatus === "STATUS_FINAL" && (
              <p className="font-semibold">Final</p>
            )}
            {matchup.metadata?.eventStatus === "STATUS_IN_PROGRESS" && (
              <p>Live</p>
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
