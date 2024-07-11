import { getUser } from "@/actions";

export async function GET(): Promise<Response> {
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
