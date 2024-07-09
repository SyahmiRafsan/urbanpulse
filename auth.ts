import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { sessionTable, userTable } from "@/db/schema";
import db from "@/db/drizzle";
import { Google } from "arctic";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable); // your adapter

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      email: attributes.email,
      image: attributes.image,
      name: attributes.name,
    };
  },
});

export const redirectURI = `${
  process.env.NODE_ENV === "production"
    ? "https://urbanpulse-asia.vercel.app"
    : "http://localhost:5420"
}/auth/`;

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID || "",
  process.env.GOOGLE_CLIENT_SECRET || "",
  redirectURI
);

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
