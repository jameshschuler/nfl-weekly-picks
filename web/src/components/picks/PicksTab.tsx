import { useSuspenseQuery } from "@tanstack/react-query";
import { scheduleQueryOptions } from "~/utils/leagues";
import { Matchup } from "./Matchup";
import { TabsContent } from "../ui/tabs";
import { Suspense, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PicksTabContent } from "./PicksTabContent";

interface PicksTabProps {
  currentWeek: string;
}

export function PicksTab({ currentWeek }: PicksTabProps) {
  const [week, setWeek] = useState(currentWeek ?? "1");

  const { data, error } = useSuspenseQuery(scheduleQueryOptions(week));
  const { matchups, isLocked } = data;

  // TODO: handle form state
  // Map<matchupId, selectedTeamId>
  // Need to load picks data and pre-fill if exists
  // TODO: handle error state

  return (
    <TabsContent value="picks">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {/* TODO: can this be moved to PicksTabContent */}
          <div className="flex items-center gap-3">
            <p>Season</p>
            <Select value="2025">
              <SelectTrigger>
                <SelectValue placeholder="Select a week" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Season</SelectLabel>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <p>Week</p>
            <Select onValueChange={(value) => setWeek(value)} value={week}>
              <SelectTrigger>
                <SelectValue placeholder="Select a week" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Week</SelectLabel>
                  {Array.from({ length: 18 }).map((_, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {index + 1}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          {/* TODO: save button appears when user makes a pick */}
          <p>Time Remaining: TBD</p>
        </div>
      </div>
      <Suspense fallback={<div>Loading Picks...</div>}>
        <PicksTabContent week={week} />
      </Suspense>
    </TabsContent>
  );
}
