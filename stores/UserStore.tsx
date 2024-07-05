import { create } from "zustand";

interface UserState {
  coordinates: { lat: number; lon: number };
  district: string | null;
  setCoordinates: (lat: number, lon: number) => void;
  setDistrict: (district: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  coordinates: { lat: 3.1582, lon: 101.7122 },
  district: null,
  setCoordinates: (lat, lon) => set({ coordinates: { lat, lon } }),
  setDistrict: (district) => set({ district }),
}));
