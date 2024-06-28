import {create} from "zustand";

interface UserState {
  coordinates: { latitude: number; longitude: number } | null;
  district: string | null;
  setCoordinates: (latitude: number, longitude: number) => void;
  setDistrict: (district: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  coordinates: null,
  district: null,
  setCoordinates: (latitude, longitude) =>
    set({ coordinates: { latitude, longitude } }),
  setDistrict: (district) => set({ district }),
}));
