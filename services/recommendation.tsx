import slugify from "slugify";

export const dummyRecommendations: Recommendation[] = [
  {
    id: "r1",
    stationName: "Bus Stop SMK Sungai Soi",
    title: "Add ramps and elevators for wheelchair access",
    upvotesCount: 6,
    commentsCount: 5,
    mode: "bus",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2d/Bus_Stop_on_Vauxhall_Bridge_Road_-_geograph.org.uk_-_598333.jpg",
  },
  {
    id: "r2",
    stationName: "Bus Stop Bandar Kajang",
    title: "Improve pedestrian walkways",
    upvotesCount: 5,
    commentsCount: 5,
    mode: "bus",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPdtVbr6pJ6HGh7ZjHPcFXn4ZFGWLdQ_jkig&s",
  },
  {
    id: "r3",
    stationName: "Bus Stop Matrade",
    title: "Bus stop shades not functional in the afternoon",
    upvotesCount: 4,
    commentsCount: 2,
    mode: "bus",
    image:
      "https://apicms.thestar.com.my/uploads/images/2022/12/15/1863908.webp",
  },
  {
    id: "r4",
    stationName: "LRT Pasar Seni",
    title: "Add ramps for wheelchair access",
    upvotesCount: 3,
    commentsCount: 6,
    mode: "lrt",
    image:
      "https://www.klia2.info/wp-content/uploads/mrt-pasar-seni-station-102.webp",
  },
  {
    id: "r5",
    stationName: "MRT Muzium Negara",
    title: "Pedestrian walkways are non-existent",
    upvotesCount: 2,
    commentsCount: 2,
    mode: "mrt",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzTb7r7kk9Q2EofiYPksVJLgJMxyuG8f626Q&s",
  },
];

export function getRecommendation(slug: string) {
  const recommendation = dummyRecommendations.filter(
    (rec) =>
      slugify(rec.stationName, {
        lower: true,
      }) == slug
  )[0];

  return recommendation;
}

// export function getRecommendationsByStationId(id: string) {
//   const recommendations = dummyRecommendations.filter(
//     (rec) => rec.station.id == id
//   )[0];

//   return recommendations;
// }
