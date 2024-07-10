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
}

interface Media {
  id: string;
  userId: string;
  createdAt: Date;
  url: string;
  mediaId: string;
  file?: File;
  mediaType: MediaType;
  mimeType: string;
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
  key: string;
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}
