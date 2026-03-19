import { redirect } from "next/navigation";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/lib";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  if (session.isLoged) redirect("/dashboard");
  return <LoginClient />;
}
