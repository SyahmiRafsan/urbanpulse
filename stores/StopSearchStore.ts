import { ALL_STOPS } from "@/lib/stops/all_stops";
import { create } from "zustand";

interface StopSearchState {
  isFullscreen: boolean;
  setIsFullscreen: (bool: boolean) => void;
  selectedStop: Stop | null;
  setSelectedStop: (stop: Stop | null) => void;
  stops: Stop[];
  filteredStops: Stop[];
  setFilteredStops: (stops: Stop[]) => void;
  initialStops: Stop[];
  setInitialStops: (stops: Stop[]) => void;
  query: string;
  setQuery: (q: string) => void;
  hideStopsWhenSearching: boolean;
  setHideStopsWhenSearching: (hideStopsWhenSearching: boolean) => void;
}

export const useStopSearchStore = create<StopSearchState>((set) => ({
  isFullscreen: false,
  setIsFullscreen: (isFullscreen: boolean) => set({ isFullscreen }),
  selectedStop: null,
  setSelectedStop: (stop: Stop | null) => set({ selectedStop: stop }),
  stops: ALL_STOPS,
  filteredStops: [],
  setFilteredStops: (filteredStops) => set({ filteredStops }),
  initialStops: [],
  setInitialStops: (initialStops) => set({ initialStops }),
  query: "",
  setQuery: (query) => set({ query }),
  hideStopsWhenSearching: true,
  setHideStopsWhenSearching: (hideStopsWhenSearching: boolean) =>
    set({ hideStopsWhenSearching }),
}));
