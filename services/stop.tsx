import db from "@/db/drizzle";
import { stopTable } from "@/db/schema";
import { ALL_STOPS } from "@/lib/stops/all_stops";
import { eq } from "drizzle-orm";

const dummyStops = [
  {
    id: 1,
    stop_name: "Bus Stop SMK Sungai Soi",
    category: "bus",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2d/Bus_Stop_on_Vauxhall_Bridge_Road_-_geograph.org.uk_-_598333.jpg",
  },
  {
    id: 2,
    stop_name: "Bus Stop Bandar Kajang",
    category: "bus",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPdtVbr6pJ6HGh7ZjHPcFXn4ZFGWLdQ_jkig&s",
  },
  {
    id: 3,
    stop_name: "Bus Stop Matrade",
    category: "bus",
    image:
      "https://apicms.thestar.com.my/uploads/images/2022/12/15/1863908.webp",
  },
  {
    id: 4,
    stop_name: "LRT Pasar Seni",
    category: "lrt",
    image:
      "https://www.klia2.info/wp-content/uploads/mrt-pasar-seni-station-102.webp",
  },
  {
    id: 5,
    stop_name: "MRT Muzium Negara",
    category: "mrt",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzTb7r7kk9Q2EofiYPksVJLgJMxyuG8f626Q&s",
  },
];
export async function getStop(id: string) {
  // const stop = ALL_STOPS.filter((st) => String(st.stop_id) == id)[0];

  const stop = await db.query.stopTable.findFirst({
    where: eq(stopTable.stopId, id),
  });

  return {
    ...stop,
    stop_name: stop?.stopName || "",
    stop_id: stop?.stopId || "",
    category: stop?.category as Category,
    stop_lat: Number(stop?.stopLat),
    stop_lon: Number(stop?.stopLon),
  };
}

export function getStopJSON(id: string) {
  const stop = ALL_STOPS.filter((st) => String(st.stop_id) == id)[0];

  return stop;
}
