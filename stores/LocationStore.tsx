import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LocationState {
  coordinates: { lat: number; lon: number };
  district: string | null;
  setCoordinates: (lat: number, lon: number) => void;
  setDistrict: (district: string) => void;
}

export const useLocationStore = create(
  persist<LocationState>(
    (set) => ({
      coordinates: { lat: 3.1582, lon: 101.7122 },
      district: null,
      setCoordinates: (lat, lon) => set({ coordinates: { lat, lon } }),
      setDistrict: (district) => set({ district }),
    }),
    {
      name: "user-location", // unique name for the storage key
      storage: createJSONStorage(() => localStorage),
      // ...
      onRehydrateStorage: (state) => {
        console.log("hydration starts");
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            state?.coordinates;
            console.log("hydration finished");
          }
        };
      },
    }
  )
);
