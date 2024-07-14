import { create } from "zustand";

interface RecommendationState {
  recommendations: Recommendation[];
  setRecommendations: (
    recommendations: Recommendation[],
    hasFetched?: boolean
  ) => void;
  hasFetched: boolean;
  sortType: SortType;
  setSortType: (sortType: SortType) => void;
  recommendationsUser: Recommendation[];
  setRecommendationsUser: (
    recommendationsUser: Recommendation[],
    hasFetchedUser?: boolean
  ) => void;
  hasFetchedUser: boolean;
  // upvotes: Record<string, number>; // Change from string[] to Record<string, number>
  // setUpvotes: (upvotes: Record<string, number>) => void; // Update to accept the new structure
  // isInUpvotes: (recommendationId: string) => boolean;
  // addUpvote: (recommendationId: string, voteCount: number) => void; // Update to accept voteCount
  // removeUpvote: (recommendationId: string) => void;
}

export const useRecommendationStore = create<RecommendationState>(
  (set, get) => ({
    recommendations: [],
    setRecommendations: (recommendations, hasFetched) =>
      set({
        recommendations: recommendations,
        hasFetched: hasFetched !== undefined ? hasFetched : true,
        // upvotes: recommendations
        //   .filter((rec) => rec.userUpvoted) // Map only recommendations where userUpvoted is true
        //   .reduce((acc, rec) => {
        //     acc[rec.id] = rec.upvotesCount;
        //     return acc;
        //   }, {} as Record<string, number>),
      }),
    hasFetched: false,
    sortType: "nearby",
    setSortType: (sortType: SortType) => set({ sortType }),
    recommendationsUser: [],
    setRecommendationsUser: (recommendationsUser, hasFetchedUser) =>
      set({
        recommendationsUser: recommendationsUser,
        hasFetchedUser: hasFetchedUser !== undefined ? hasFetchedUser : true,
        // upvotes: recommendationsUser
        //   .filter((rec) => rec.userUpvoted) // Map only recommendations where userUpvoted is true
        //   .reduce((acc, rec) => {
        //     acc[rec.id] = rec.upvotesCount;
        //     return acc;
        //   }, {} as Record<string, number>),
      }),
    hasFetchedUser: false,
    // upvotes: {},
    // setUpvotes: (upvotes: Record<string, number>) => set({ upvotes }),
    // isInUpvotes: (recommendationId: string) => {
    //   return recommendationId in get().upvotes;
    // },
    // addUpvote: (recommendationId: string, voteCount: number) => {
    //   set((state) => ({
    //     upvotes: {
    //       ...state.upvotes,
    //       [recommendationId]: voteCount,
    //     },
    //   }));
    // },
    // removeUpvote: (recommendationId: string) => {
    //   set((state) => {
    //     const { [recommendationId]: _, ...rest } = state.upvotes;
    //     return { upvotes: rest };
    //   });
    // },
  })
);
