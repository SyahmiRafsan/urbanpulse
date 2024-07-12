import { DateTime } from "luxon";

export const dummyRecommendations: Recommendation[] = [
  {
    id: "r1",
    stop: {
      stopName: "KL1821 PASAR SENI (PLATFORM A1 - A2)",
      id: "",
      stopId: String(1004342),
    },
    title: "Add ramps and elevators for wheelchair access",
    description: "Example desc",
    upvotesCount: 6,
    commentsCount: 5,
    category: "bus",
    createdAt: DateTime.now().toJSDate(),
    media: [
      {
        id: "abc",
        createdAt: DateTime.now().toJSDate(),
        url: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Bus_Stop_on_Vauxhall_Bridge_Road_-_geograph.org.uk_-_598333.jpg",
        recommendationId: "r1",
        userId: "123",
        mimeType: "",
      },
    ],
    highlights: ["Connectivity", "Safety", "Quality Of Life"],
    userId: "",
  },
  {
    id: "r2",
    stop: {
      stopName: "KL112 KOTA RAYA",
      id: "",
      stopId: String(1001672),
    },
    title: "Improve pedestrian walkways",
    description: "Example desc",
    upvotesCount: 5,
    commentsCount: 5,
    category: "bus",
    createdAt: DateTime.now().toJSDate(),
    media: [
      {
        id: "abc",
        createdAt: DateTime.now().toJSDate(),
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPdtVbr6pJ6HGh7ZjHPcFXn4ZFGWLdQ_jkig&s",
        recommendationId: "r2",
        userId: "123",
        mimeType: "",
      },
    ],
    highlights: ["Connectivity", "Safety", "Quality Of Life"],
    userId: "",
  },
  {
    id: "r3",
    stop: {
      stopName: "KL105 LRT MASJID JAMEK",
      id: "",
      stopId: String(1001810),
    },
    title: "Bus stop shades not functional in the afternoon",
    description: "Example desc",
    upvotesCount: 4,
    commentsCount: 2,
    category: "bus",
    createdAt: DateTime.now().toJSDate(),
    media: [
      {
        id: "abc",
        createdAt: DateTime.now().toJSDate(),
        url: "https://apicms.thestar.com.my/uploads/images/2022/12/15/1863908.webp",
        recommendationId: "r3",
        userId: "123",
        mimeType: "",
      },
    ],
    highlights: ["Connectivity", "Safety", "Quality Of Life"],
    userId: "",
  },
  {
    id: "r4",
    stop: {
      stopName: "AMPANG",
      id: "",
      stopId: "AG18",
    },
    title: "Add ramps for wheelchair access",
    description: "Example desc",
    upvotesCount: 3,
    commentsCount: 6,
    category: "lrt",
    createdAt: DateTime.now().toJSDate(),
    media: [
      {
        id: "abc",
        createdAt: DateTime.now().toJSDate(),
        url: "https://www.klia2.info/wp-content/uploads/mrt-pasar-seni-station-102.webp",
        recommendationId: "r4",
        userId: "123",
        mimeType: "",
      },
    ],
    highlights: ["Connectivity", "Safety", "Quality Of Life"],
    userId: "",
  },
  {
    id: "r5",
    stop: {
      stopName: "KWASA DAMANSARA",
      id: "",
      stopId: "KG04",
    },
    title: "Pedestrian walkways are non-existent",
    description: "Example desc",
    upvotesCount: 2,
    commentsCount: 2,
    category: "mrt",
    createdAt: DateTime.now().toJSDate(),
    media: [
      {
        id: "abc",
        createdAt: DateTime.now().toJSDate(),
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzTb7r7kk9Q2EofiYPksVJLgJMxyuG8f626Q&s",
        recommendationId: "r5",
        userId: "123",
        mimeType: "",
      },
    ],
    highlights: ["Connectivity", "Safety", "Quality Of Life"],
    userId: "",
  },
];
