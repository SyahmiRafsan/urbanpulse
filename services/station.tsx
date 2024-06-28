import slugify from "slugify";

 const dummyStations = [
    {
      id: 1,
      name: "Bus Stop SMK Sungai Soi",
      mode: "bus",
      image:'https://upload.wikimedia.org/wikipedia/commons/2/2d/Bus_Stop_on_Vauxhall_Bridge_Road_-_geograph.org.uk_-_598333.jpg'
    },
    {
      id: 2,
      name: "Bus Stop Bandar Kajang",
      mode: "bus",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPdtVbr6pJ6HGh7ZjHPcFXn4ZFGWLdQ_jkig&s",
    },
    {
      id: 3,
      name: "Bus Stop Matrade",
      mode: "bus",
      image:
        "https://apicms.thestar.com.my/uploads/images/2022/12/15/1863908.webp",
    },
    {
      id: 4,
      name: "LRT Pasar Seni",
      mode: "lrt",
      image:
        "https://www.klia2.info/wp-content/uploads/mrt-pasar-seni-station-102.webp",
    },
    {
      id: 5,
      name: "MRT Muzium Negara",
      mode: "mrt",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzTb7r7kk9Q2EofiYPksVJLgJMxyuG8f626Q&s",
    },
  ];
  export function getStation(slug: string) {
    const station = dummyStations.filter(
      (st) =>
        slugify(st.name, {
          lower: true,
        }) == slug
    )[0];
  
    return station;
  }
  