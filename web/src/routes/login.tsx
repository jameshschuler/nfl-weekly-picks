import { createFileRoute, redirect } from "@tanstack/react-router";
import { Login } from "../components/Login";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  beforeLoad: async (context) => {
    const { user } = context.context;
    if (user) {
      throw redirect({
        to: "/leagues",
      });
    }
  },
});

function LoginPage() {
  return <Login />;
}
