import { redirect, createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { useMutation } from "../hooks/useMutation";
import { Auth } from "../components/Auth";
import { getSupabaseServerClient } from "../utils/supabase";

export const signupFn = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { email: string; password: string; redirectUrl?: string }) => d
  )
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    // TODO: make sure email validation works
    const { data: userData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return {
        error: true,
        message: error.message,
      };
    }

    const { data: defaultLeague } = await supabase
      .schema("nflweeklypicks")
      .from("leagues")
      .select("id")
      .eq("is_system_default", true)
      .single();

    // TODO: add logging in case this errors
    await supabase.schema("nflweeklypicks").from("league_users").insert({
      user_id: userData.user?.id,
      league_id: defaultLeague!.id,
    });

    throw redirect({
      href: "/leagues",
    });
  });

export const Route = createFileRoute("/signup")({
  component: SignupComp,
});

function SignupComp() {
  const signupMutation = useMutation({
    fn: useServerFn(signupFn),
  });

  return (
    <Auth
      actionText="Sign Up"
      status={signupMutation.status}
      onSubmit={(e) => {
        const formData = new FormData(e.target as HTMLFormElement);

        signupMutation.mutate({
          data: {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          },
        });
      }}
      afterSubmit={
        signupMutation.data?.error ? (
          <>
            <div className="text-red-400">{signupMutation.data.message}</div>
          </>
        ) : null
      }
    />
  );
}
