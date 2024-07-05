import { RAPID_BUS_KL_STOPS } from "./rapid_bus_kl";
import { RAPID_RAIL_KL_STOPS } from "./rapid_rail_kl";

export   const ALL_STOPS = [
    ...RAPID_RAIL_KL_STOPS,
    ...RAPID_BUS_KL_STOPS.map((stop) => ({
      ...stop,
      category: "bus",
    })),
  ];