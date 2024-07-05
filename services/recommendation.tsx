import slugify from "slugify";

export const dummyRecommendations: Recommendation[] = [
  {
    id: "r1",
    stop_name: "KL1821 PASAR SENI (PLATFORM A1 - A2)",
    stop_id: 1004342,
    title: "Add ramps and elevators for wheelchair access",
    upvotesCount: 6,
    commentsCount: 5,
    category: "bus",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2d/Bus_Stop_on_Vauxhall_Bridge_Road_-_geograph.org.uk_-_598333.jpg",
  },
  {
    id: "r2",
    stop_name: "KL112 KOTA RAYA",
    stop_id: 1001672,
    title: "Improve pedestrian walkways",
    upvotesCount: 5,
    commentsCount: 5,
    category: "bus",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPdtVbr6pJ6HGh7ZjHPcFXn4ZFGWLdQ_jkig&s",
  },
  {
    id: "r3",
    stop_name: "KL105 LRT MASJID JAMEK",
    stop_id: 1001810,
    title: "Bus stop shades not functional in the afternoon",
    upvotesCount: 4,
    commentsCount: 2,
    category: "bus",
    image:
      "https://apicms.thestar.com.my/uploads/images/2022/12/15/1863908.webp",
  },
  {
    id: "r4",
    stop_name: "AMPANG",
    stop_id: "AG18",
    title: "Add ramps for wheelchair access",
    upvotesCount: 3,
    commentsCount: 6,
    category: "lrt",
    image:
      "https://www.klia2.info/wp-content/uploads/mrt-pasar-seni-station-102.webp",
  },
  {
    id: "r5",
    stop_name: "KWASA DAMANSARA",
    stop_id: "KG04",
    title: "Pedestrian walkways are non-existent",
    upvotesCount: 2,
    commentsCount: 2,
    category: "mrt",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzTb7r7kk9Q2EofiYPksVJLgJMxyuG8f626Q&s",
  },
];

export function getRecommendation(id: string) {
  const recommendation = dummyRecommendations.filter(
    (rec) => rec.stop_id == id
  )[0];

  return recommendation;
}
