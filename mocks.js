const USERS = [
  {
    id: "u1",
    name: "Andrew",
    image:
      "https://www.wykop.pl/cdn/c3397992/niedoszly_andrzej_L3RXYYrnY9,q48.jpg",
    places: 3,
    email: "andrew@gmail.com",
    password: "test1",
  },
  {
    id: "u2",
    name: "Blueberry",
    image: "https://www.wykop.pl/cdn/c3397992/koroluk_StE6gbt0eO,q150.jpg",
    places: 1,
    email: "blueberry@gmail.com",
    password: "test2",
  },
];

const PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrappers in the world",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Orthodox Church of St. Nicholas",
    description: "Orthodox Church in Szczecin",
    imageUrl:
      "https://thumbs.dreamstime.com/z/orthodox-parish-st-nicholas-altar-b-poland-szczecin-june-63083420.jpg",
    address: "Zygmunta Starego 1A, 71-899 Szczecin, Poland",
    location: {
      lat: 53.430453,
      lng: 14.55971,
    },
    creator: "u2",
  },
  {
    id: "p3",
    title: "Wall Street",
    description: "Where money lives",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/f5/Photos_NewYork1_032.jpg",
    address: "11 Wall St, New York, NY 10005, United States",
    location: {
      lat: 40.707641507623975,
      lng: -74.01126539998386,
    },
    creator: "u1",
  },
];

module.exports = { PLACES, USERS };
