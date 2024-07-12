import { create } from "zustand";

interface ImageState {
  isOpen: boolean;
  image: Media | MediaComment | null;
  setImage: (image: Media | MediaComment) => void;
  clearImage: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
  isOpen: false,
  image: null,
  setImage: (image: Media | MediaComment) => set({ image, isOpen: true }),
  clearImage: () => set({ image: null, isOpen: false }),
}));
