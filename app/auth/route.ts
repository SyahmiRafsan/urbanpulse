import { google, lucia } from "@/auth";
import db from "@/db/drizzle";
import { userTable } from "@/db/schema";
import { hashEmail, encrypt, decrypt } from "@/lib/enc";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

// Function to fetch Google user profile
async function fetchGoogleUserProfile(accessToken: string) {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Google user profile");
  }

  return response.json();
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const storedVerifier = cookies().get("code_verifier")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !storedVerifier
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, storedVerifier);

    const googleUser = await fetchGoogleUserProfile(tokens.accessToken);

    // Hash the email for user existence check
    const hashedEmail = hashEmail(googleUser.email);

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.emailHash, hashedEmail),
    });

    if (existingUser) {
      const userId = existingUser.id;
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    // Encrypt the email for storage
    const encryptedEmail = encrypt(googleUser.email);

    // Insert new user
    const newUser = await db
      .insert(userTable)
      .values([
        {
          email: encryptedEmail, // Store the encrypted email
          emailHash: hashedEmail, // Store the hashed email for lookups
          name: encrypt(googleUser.name),
          image: encrypt(googleUser.picture),
        },
      ])
      .returning();

    const session = await lucia.createSession(newUser[0].id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    // the specific error message depends on the provider

    console.log(e);
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
