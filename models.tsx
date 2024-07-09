interface Recommendation {
  id: string;
  description: string;
  stop_name: string;
  stop_id: string | number;
  title: string;
  upvotesCount: number;
  commentsCount: number;
  category: string;
  highlights: string[];
  media: Media[];
  createdAt: string;
}

interface Media {
  id: string;
  url: string;
  recommendationId: string;
  createdAt: string;
}

type Category = "LRT" | "MRT" | "MR" | "BUS" | "BRT";

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
