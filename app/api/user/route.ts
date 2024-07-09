import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { cache } from "react";

export async function GET(): Promise<Response> {
  const getUser = cache(async () => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    // console.log({ sessionId, cName: lucia.sessionCookieName });

    if (!sessionId) return null;
    const { user, session } = await lucia.validateSession(sessionId);
    try {
      if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {
      // Next.js throws error when attempting to set cookies when rendering page
    }
    return user;
  });

  try {
    const user = await getUser();
    return Response.json(user, { status: 200 });
  } catch (error) {
    return Response.json(
      {},
      { status: 500, statusText: "Failed to fetch user" }
    );
  }
}
