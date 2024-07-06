import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RecommendationState {
  recommendationDrafts: Recommendation[];
  updateDraft: (rec: Recommendation) => void;
  addDraft: (rec: Recommendation) => void;
}

export const useRecommendationStore = create(
  persist<RecommendationState>(
    (set, get) => ({
      recommendationDrafts: [],
      updateDraft: (updatedRec) =>
        set({
          recommendationDrafts: get().recommendationDrafts.map((rc) =>
            rc.id == updatedRec.id ? updatedRec : rc
          ),
        }),
      addDraft: (updatedRec) =>
        set({
          recommendationDrafts: [updatedRec, ...get().recommendationDrafts],
        }),
    }),
    {
      name: "user-recommendation", // unique name for the storage key
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
