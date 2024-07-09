import db from "@/db/drizzle";
import { stopTable } from "@/db/schema";
import { ALL_STOPS } from "@/lib/stops/all_stops";
import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  try {
    const insertStops = await db
      .insert(stopTable)
      .values(
        ALL_STOPS.map((st) => ({
          stopId: st.stop_id,
          stopName: st.stop_name,
          stopLat: String(st.stop_lat),
          stopLon: String(st.stop_lon),
          category: st.category as Category,
          updatedAt: new Date(),
        }))
      )
      .returning({ insertedId: stopTable.id });

    return NextResponse.json(insertStops);
  } catch (error) {
    console.error("Error inserting stops:", error);
    return NextResponse.json(
      { error: "Failed to insert stops" },
      { status: 500 }
    );
  }
}
