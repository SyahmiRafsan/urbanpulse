import { ALL_STOPS } from "@/lib/stops/all_stops";
import { create } from "zustand";

interface StopSearchState {
  isFullscreen: boolean;
  setIsFullscreen: (bool: boolean) => void;
  stops: Stop[];
  filteredStops: Stop[];
  setFilteredStops: (stops: Stop[]) => void;
  query: string;
  setQuery: (q: string) => void;
}

export const useStopSearchStore = create<StopSearchState>((set) => ({
  isFullscreen: false,
  setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),
  stops: ALL_STOPS,
  filteredStops: [],
  setFilteredStops: (filteredStops) => set({ filteredStops }),
  query: "",
  setQuery: (query) => set({ query }),
}));
