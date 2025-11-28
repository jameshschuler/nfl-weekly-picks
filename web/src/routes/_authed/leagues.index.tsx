import {
  createFileRoute,
  ErrorComponent,
  ErrorComponentProps,
  Link,
} from "@tanstack/react-router";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { NotFound } from "~/components/NotFound";
import { fetchLeagues } from "~/utils/leagues";

const MAX_AVATARS = 8;

export const Route = createFileRoute("/_authed/leagues/")({
  component: RouteComponent,
  loader: () => fetchLeagues(),
  errorComponent: LeagueErrorComponent,
  notFoundComponent: () => {
    return <NotFound>No Leagues Found</NotFound>;
  },
});

export function LeagueErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />;
}

function RouteComponent() {
  const { defaultLeague, leagues } = Route.useLoaderData();
  const { user } = Route.useRouteContext();

  return (
    <div className="px-8 pb-8 flex flex-col gap-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold">Leagues</h1>
        <Button>Invite Friends</Button>
      </div>
      <div>
        <h3 className="text-2xl">Starter Leagues</h3>
        <Card className="mt-12 max-w-96">
          <CardHeader>
            <CardTitle>{defaultLeague?.name}</CardTitle>
            {/* <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction> */}
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <p>Players</p>
              <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
                {Array.from({
                  length: Math.min(defaultLeague?.userCount ?? 0, MAX_AVATARS),
                }).map((_, index) => (
                  <Avatar key={index}>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>P{index + 1}</AvatarFallback>
                  </Avatar>
                ))}
                {defaultLeague?.userCount! > MAX_AVATARS && (
                  <Avatar>
                    <AvatarFallback>
                      +{defaultLeague?.userCount! - MAX_AVATARS}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link
                to="/leagues/$leagueId"
                params={{ leagueId: defaultLeague!.id }}
              >
                View League
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-2xl flex-1">Your Leagues</h3>
          <Input placeholder="Search..." className="flex-1" />
        </div>

        {leagues.length === 0 && (
          <div>
            <p className="mt-4">
              You are not a member of any leagues. Try creating a new one!
            </p>
            <Button className="mt-2">Create League</Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {leagues.map((league) => (
            <Card key={league.id}>
              <CardHeader>
                <CardTitle>{league.name}</CardTitle>
                <CardDescription>Card Description</CardDescription>
                {user?.id === league.createdBy && (
                  <CardAction>
                    <Button variant="link">Edit</Button>
                  </CardAction>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <p>Players</p>
                  {/* TODO: move this to league details page */}
                  {/* {league?.userCount <= 1 && (
                    <div>
                      <p className="mt-4">
                        Looks like it could use some players
                      </p>
                      <Button>Invite Players</Button>
                    </div>
                  )} */}
                  <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
                    {Array.from({
                      length: Math.min(league?.userCount ?? 0, MAX_AVATARS),
                    }).map((_, index) => (
                      <Avatar key={index}>
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>P{index + 1}</AvatarFallback>
                      </Avatar>
                    ))}
                    {league?.userCount! > MAX_AVATARS && (
                      <Avatar>
                        <AvatarFallback>
                          +{league?.userCount! - MAX_AVATARS}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link
                    to="/leagues/$leagueId"
                    params={{ leagueId: league.id }}
                  >
                    View League
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
