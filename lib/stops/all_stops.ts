import { RAPID_BUS_KL_STOPS } from "./rapid_bus_kl";
import { RAPID_RAIL_KL_STOPS } from "./rapid_rail_kl";

export const ALL_STOPS = [
  ...RAPID_RAIL_KL_STOPS.map((stop) => ({
    stop_id: stop.stop_id,
    stop_name: stop.stop_name,
    stop_lat: stop.stop_lat,
    stop_lon: stop.stop_lon,
    category: stop.category as Category,
  })),
  ...RAPID_BUS_KL_STOPS.map((stop) => ({
    stop_id: String(stop.stop_id),
    stop_name: stop.stop_name,
    stop_lat: stop.stop_lat,
    stop_lon: stop.stop_lon,
    category: "BUS" as Category,
  })),
];
