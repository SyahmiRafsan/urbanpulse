import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    {
      headers,
    }
  );
  const data = await res.json();

  // example: https://nominatim.openstreetmap.org/ui/reverse.html?lat=3.1490&lon=101.7134

  return Response.json({ ...data.address });
}
