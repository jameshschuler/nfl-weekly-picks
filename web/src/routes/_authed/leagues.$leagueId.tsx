import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ErrorComponent, Link, createFileRoute } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Suspense, useState } from "react";
import { NotFound } from "~/components/NotFound";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
  CardAction,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  fetchLeague,
  fetchSchedule,
  scheduleQueryOptions,
} from "~/utils/leagues";

export const Route = createFileRoute("/_authed/leagues/$leagueId")({
  loader: ({ params: { leagueId } }) => fetchLeague({ data: leagueId }),
  errorComponent: LeagueErrorComponent,
  component: LeagueComponent,
  notFoundComponent: () => {
    return <NotFound>League not found</NotFound>;
  },
});

export function LeagueErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />;
}

interface PicksProps {
  week: string;
}

function Picks({ week }: PicksProps) {
  const { data, error } = useSuspenseQuery(scheduleQueryOptions(week));

  return (
    //TODO: maybe use Item component
    <Table className="w-full">
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead>Game</TableHead>
          {/* <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Amount</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((schedule) => (
          <TableRow key={schedule.id}>
            <TableCell>{schedule.name}</TableCell>
            {/* <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell> */}
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
}

function LeagueComponent() {
  const league = Route.useLoaderData();
  const { user } = Route.useRouteContext();

  const [week, setWeek] = useState("1");

  return (
    <div className="px-8 pb-8 flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold">{league.name}</h1>
        <div className="flex gap-2">
          {user?.id === league.createdBy && <Button>Edit</Button>}
          <Button>Invite Friends</Button>
        </div>
      </div>
      <div className="flex justify-between gap-8">
        <Tabs defaultValue="picks" className="flex-1 gap-4">
          <TabsList>
            <TabsTrigger value="picks">Picks</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          <TabsContent value="picks">
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
            <Suspense fallback={<div>Loading Picks...</div>}>
              <Picks week={week} />
            </Suspense>
          </TabsContent>
          <TabsContent value="results">Change your password here.</TabsContent>
          <TabsContent value="leaderboard">
            Change your password here.
          </TabsContent>
        </Tabs>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Players</CardTitle>
              <CardDescription>Card Description</CardDescription>
              <CardAction>Manage</CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {Array.from({
                  length: Math.min(league.userCount.at(0)?.count ?? 0),
                }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p>Tester McTester</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button>View All</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
