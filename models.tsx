interface Recommendation {
  id: string;
  description?: string;
  stop_name: string;
  stop_id: string | number;
  title: string;
  upvotesCount: number;
  commentsCount: number;
  category: string;
  highlights: string[];
  media: Media[];
  createdOn: string;
}

interface Media {
  id: string;
  url: string;
  recommendationId: string;
  createdOn: string;
}

type Category = "lrt" | "mrt" | "mr" | "bus";

interface Stop {
  stop_id: string | number;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  category: Category | string;
  route_id?: string;
  geometry?: string;
  isOKU?: boolean;
  status?: string;
  search?: string;
}
