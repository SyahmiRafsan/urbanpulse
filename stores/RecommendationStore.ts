import { create } from "zustand";

interface RecommendationState {
  recommendations: Recommendation[];
  setRecommendations: (
    recommendations: Recommendation[],
    hasFetched?: boolean
  ) => void;
  hasFetched: boolean;
  recommendationsUser: Recommendation[];
  setRecommendationsUser: (
    recommendationsUser: Recommendation[],
    hasFetchedUser?: boolean
  ) => void;
  hasFetchedUser: boolean;
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendations: [],
  setRecommendations: (recommendations, hasFetched) =>
    set({
      recommendations,
      hasFetched: hasFetched !== undefined ? hasFetched : true,
    }),
  hasFetched: false,
  recommendationsUser: [],
  setRecommendationsUser: (recommendationsUser, hasFetchedUser) =>
    set({
      recommendationsUser,
      hasFetchedUser: hasFetchedUser !== undefined ? hasFetchedUser : true,
    }),
  hasFetchedUser: false,
}));
