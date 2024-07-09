import { lucia } from "@/auth";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (sessionId) {
    await lucia.invalidateSession(sessionId);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  }

  const url =
    process.env.NODE_ENV === "production"
      ? "https://urbanpulse-asia.vercel.app/"
      : "http://localhost:5420/";
  return Response.redirect(url);
}
