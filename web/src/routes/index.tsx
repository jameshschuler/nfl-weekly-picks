import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const Route = createFileRoute("/")({
  component: Home,
  beforeLoad: async (context) => {
    const { user } = context.context;
    if (user) {
      throw redirect({
        to: "/leagues",
      });
    }
  },
});

function Home() {
  return (
    <div className="p-2">
      <h2>The Ultimate Football Pick'em League</h2>
      <h3>
        Create your league, challenge your friends, and dominate the season with
        weekly game predictions.
      </h3>
      <Button asChild>
        <Link to="/signup">Join Now</Link>
      </Button>
      <DotLottieReact
        src="https://lottie.host/07f77cfb-961a-45b0-98a3-283abbe92f8d/467Xm0ltZz.lottie"
        //loop
        autoplay
      />
    </div>
  );
}
