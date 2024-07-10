import { create } from "zustand";

interface RecommendationState {
  recommendations: Recommendation[];
  setRecommendations: (recommendations: Recommendation[]) => void;
  hasFetched: boolean;
  recommendationsUser: Recommendation[];
  setRecommendationsUser: (recommendationsUser: Recommendation[]) => void;
  hasFetchedUser: boolean;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendations: [],
  setRecommendations: (recommendations) =>
    set({ recommendations, hasFetched: true }),
  hasFetched: false,
  recommendationsUser: [],
  setRecommendationsUser: (recommendationsUser) =>
    set({ recommendationsUser, hasFetchedUser: true }),
  hasFetchedUser: false,
}));
