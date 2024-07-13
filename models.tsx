interface Recommendation {
  id: string;
  description: string;
  stop: { id: string; stopId: string | null; stopName: string };
  stopName?: string;
  stopId?: string | number;
  title: string;
  upvotesCount: number;
  commentsCount: number;
  category: string;
  highlights: string[];
  media: Media[];
  createdAt: Date;
  updatedAt?: Date;
  userId: string;
  userUpvoted?: boolean | null;
  user?: DatabaseUserAttributes;
  comments?: RecommendationComment[];
}

interface Media {
  id: string;
  userId: string;
  createdAt: Date;
  url: string;
  recommendationId: string;
  file?: File;
  mimeType: string;
}

interface MediaComment {
  id: string;
  userId: string;
  createdAt: Date;
  url: string;
  commentId: string;
  file?: File;
  mimeType: string;
}


interface RecommendationComment {
  id: string;
  recommendationId: string;
  content: string;
  createdAt: Date;
  userId: string;
  media: MediaComment[];
  user?: DatabaseUserAttributes;
}

type MediaType = "RECOMMENDATION" | "COMMENT";

type Category = "LRT" | "MRT" | "MR" | "BUS" | "BRT";

type RecommendationHighlight =
  | "ACCESSIBILITY"
  | "CONNECTIVITY"
  | "EFFICIENCY"
  | "ENVIRONMENTAL"
  | "QUALITY_OF_LIFE"
  | "SAFETY";

interface Stop {
  id?: string;
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  category: Category;
}

interface DatabaseUserAttributes {
  id: string;
  email: string;
  name: string;
  image: string;
}

interface UploadedFile {
  id: string;
  key: string;
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  url?: string;
}

type SortType = "nearby" | "latest" | "most_upvoted";

interface FetchRecommendationsOptions {
  userId?: string;
  sortType: SortType;
  userLat?: number;
  userLon?: number;
}

interface Coordinate {
  lat: number;
  lon: number;
}
