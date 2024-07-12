import { create } from "zustand";

interface ImageState {
  isOpen: boolean;
  image: Media | null;
  setImage: (image: Media) => void;
  clearImage: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
  isOpen: false,
  image: null,
  setImage: (image: Media) => set({ image, isOpen: true }),
  clearImage: () => set({ image: null, isOpen: false }),
}));
