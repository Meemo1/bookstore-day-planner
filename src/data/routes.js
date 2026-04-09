// Saturday route itinerary
export const saturdayRoute = [
  {
    type: "store",
    id: "ballast",
    storeId: "ballast",
    time: "8:00 AM",
    timeMinutes: 8 * 60,
    travelFrom: "Home",
    travelTime: "~1.5 hr drive via Tacoma Narrows",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=7353%2019th%20Ave%20NW%2C%20Seattle%2C%20WA&destination=409%20Pacific%20Ave%2C%20Bremerton%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "awaywithwords",
    storeId: "awaywithwords",
    time: "8:39 AM",
    timeMinutes: 8 * 60 + 39,
    travelFrom: "Ballast Book Co.",
    travelTime: "29 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=409%20Pacific%20Ave%2C%20Bremerton%2C%20WA&destination=18954%20Front%20St%20NE%2C%20Poulsbo%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "libertybay",
    storeId: "libertybay",
    time: "8:53 AM",
    timeMinutes: 8 * 60 + 53,
    travelFrom: "Away With Words",
    travelTime: "4 min walk",
    directionMode: "walking",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=18954%20Front%20St%20NE%2C%20Poulsbo%2C%20WA&destination=18881%20Front%20St%20NE%2C%20Poulsbo%2C%20WA&travelmode=walking",
  },
  {
    type: "store",
    id: "eagleharbor",
    storeId: "eagleharbor",
    time: "9:26 AM",
    timeMinutes: 9 * 60 + 26,
    travelFrom: "Liberty Bay Books",
    travelTime: "23 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=18881%20Front%20St%20NE%2C%20Poulsbo%2C%20WA&destination=157%20Winslow%20Way%20E%2C%20Bainbridge%20Island%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "saltwater",
    storeId: "saltwater",
    time: "10:06 AM",
    timeMinutes: 10 * 60 + 6,
    travelFrom: "Eagle Harbor Book Co.",
    travelTime: "30 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=157%20Winslow%20Way%20E%2C%20Bainbridge%20Island%2C%20WA&destination=10978%20NE%20State%20Hwy%20104%2C%20Kingston%2C%20WA&travelmode=driving",
  },
  {
    type: "ferry-warning",
    id: "ferry-kingston-warning",
    time: "10:20 AM",
    timeMinutes: 10 * 60 + 20,
    label: "Arrive Kingston Ferry Terminal",
    description: "Leave Saltwater by 10:20 to catch 11:05 ferry",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=10978%20NE%20State%20Hwy%20104%2C%20Kingston%2C%20WA&destination=Kingston%20Ferry%20Terminal%2C%20Kingston%2C%20WA&travelmode=driving",
    urgent: true,
  },
  {
    type: "ferry",
    id: "ferry-kingston-edmonds",
    time: "11:05 AM",
    timeMinutes: 11 * 60 + 5,
    label: "Kingston → Edmonds Ferry",
    description: "30 min crossing — arrive terminal by 10:20 AM!",
    ferryFrom: "Kingston Ferry Terminal",
    ferryTo: "Edmonds Ferry Terminal",
    duration: 30,
    departTime: "11:05 AM",
    arriveTime: "11:35 AM",
    lineupBy: "10:20 AM",
    urgent: true,
  },
  {
    type: "store",
    id: "eastwest",
    storeId: "eastwest",
    time: "11:40 AM",
    timeMinutes: 11 * 60 + 40,
    travelFrom: "Edmonds Ferry Terminal",
    travelTime: "5 min from dock",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=Edmonds%20Ferry%20Terminal%2C%20Edmonds%2C%20WA&destination=110%203rd%20Ave%20N%2C%20Edmonds%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "edmondsbookshop",
    storeId: "edmondsbookshop",
    time: "11:54 AM",
    timeMinutes: 11 * 60 + 54,
    travelFrom: "East West Books & Gifts",
    travelTime: "4 min walk",
    directionMode: "walking",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=110%203rd%20Ave%20N%2C%20Edmonds%2C%20WA&destination=111%20Fifth%20Ave%20S%2C%20Edmonds%2C%20WA&travelmode=walking",
  },
  {
    type: "meal",
    id: "sat-lunch",
    time: "12:10 PM",
    timeMinutes: 12 * 60 + 10,
    label: "LUNCH BREAK",
    description: "~20 minutes in Edmonds",
    duration: 20,
  },
  {
    type: "store",
    id: "ridgecrest",
    storeId: "ridgecrest",
    time: "12:47 PM",
    timeMinutes: 12 * 60 + 47,
    travelFrom: "Edmonds",
    travelTime: "17 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=111%20Fifth%20Ave%20S%2C%20Edmonds%2C%20WA&destination=512%20NE%20165th%20St%2C%20Shoreline%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "booktree",
    storeId: "booktree",
    time: "1:27 PM",
    timeMinutes: 13 * 60 + 27,
    travelFrom: "Ridgecrest Books",
    travelTime: "30 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=512%20NE%20165th%20St%2C%20Shoreline%2C%20WA&destination=609%20Market%20St%2C%20Kirkland%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "brickmortar",
    storeId: "brickmortar",
    time: "1:55 PM",
    timeMinutes: 13 * 60 + 55,
    travelFrom: "BookTree",
    travelTime: "18 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=609%20Market%20St%2C%20Kirkland%2C%20WA&destination=7430%20164th%20Ave%20NE%2C%20Redmond%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "islandbooks",
    storeId: "islandbooks",
    time: "2:29 PM",
    timeMinutes: 14 * 60 + 29,
    travelFrom: "Brick & Mortar Books",
    travelTime: "24 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=7430%20164th%20Ave%20NE%2C%20Redmond%2C%20WA&destination=3014%2078th%20Ave%20SE%2C%20Mercer%20Island%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "fantagraphics",
    storeId: "fantagraphics",
    time: "2:57 PM",
    timeMinutes: 14 * 60 + 57,
    travelFrom: "Island Books",
    travelTime: "18 min via I-90",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=3014%2078th%20Ave%20SE%2C%20Mercer%20Island%2C%20WA&destination=1201%20S%20Vale%20St%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "page2",
    storeId: "page2",
    time: "3:22 PM",
    timeMinutes: 15 * 60 + 22,
    travelFrom: "Fantagraphics",
    travelTime: "15 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=1201%20S%20Vale%20St%2C%20Seattle%2C%20WA&destination=560%20SW%20152nd%20St%2C%20Burien%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "threetrees",
    storeId: "threetrees",
    time: "3:37 PM",
    timeMinutes: 15 * 60 + 37,
    travelFrom: "Page 2 Books",
    travelTime: "5 min walk",
    directionMode: "walking",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=560%20SW%20152nd%20St%2C%20Burien%2C%20WA&destination=827%20SW%20152nd%20St%2C%20Burien%2C%20WA&travelmode=walking",
  },
  {
    type: "store",
    id: "paperboat",
    storeId: "paperboat",
    time: "4:13 PM",
    timeMinutes: 16 * 60 + 13,
    travelFrom: "Three Trees Books",
    travelTime: "26 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=827%20SW%20152nd%20St%2C%20Burien%2C%20WA&destination=4522%20California%20Ave%20SW%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "nookcranny",
    storeId: "nookcranny",
    time: "4:51 PM",
    timeMinutes: 16 * 60 + 51,
    travelFrom: "Paper Boat Booksellers",
    travelTime: "28 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=4522%20California%20Ave%20SW%2C%20Seattle%2C%20WA&destination=5637%20University%20Way%20NE%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "lovestruck",
    storeId: "lovestruck",
    time: "5:11 PM",
    timeMinutes: 17 * 60 + 11,
    travelFrom: "Nook & Cranny Books",
    travelTime: "10 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=5637%20University%20Way%20NE%2C%20Seattle%2C%20WA&destination=8507%2035th%20Ave%20NE%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "thirdplaceravenna",
    storeId: "thirdplaceravenna",
    time: "5:31 PM",
    timeMinutes: 17 * 60 + 31,
    travelFrom: "Lovestruck in Seattle",
    travelTime: "10 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=8507%2035th%20Ave%20NE%2C%20Seattle%2C%20WA&destination=6504%2020th%20Ave%20NE%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "home",
    id: "sat-home",
    time: "~5:55 PM",
    timeMinutes: 17 * 60 + 55,
    label: "Home",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=6504%2020th%20Ave%20NE%2C%20Seattle%2C%20WA&destination=7353%2019th%20Ave%20NW%2C%20Seattle%2C%20WA&travelmode=driving",
  },
];

// Sunday route itinerary
export const sundayRoute = [
  {
    type: "store",
    id: "madisonbooks",
    storeId: "madisonbooks",
    time: "10:00 AM",
    timeMinutes: 10 * 60,
    travelFrom: "Home",
    travelTime: "15 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=7353%2019th%20Ave%20NW%2C%20Seattle%2C%20WA&destination=4118%20E%20Madison%20St%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "adas",
    storeId: "adas",
    time: "10:20 AM",
    timeMinutes: 10 * 60 + 20,
    travelFrom: "Madison Books",
    travelTime: "5 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=4118%20E%20Madison%20St%2C%20Seattle%2C%20WA&destination=425%2015th%20Ave%20E%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "elliottbay",
    storeId: "elliottbay",
    time: "10:40 AM",
    timeMinutes: 10 * 60 + 40,
    travelFrom: "Ada's Technical Books",
    travelTime: "5 min walk",
    directionMode: "walking",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=425%2015th%20Ave%20E%2C%20Seattle%2C%20WA&destination=1521%2010th%20Ave%2C%20Seattle%2C%20WA&travelmode=walking",
  },
  {
    type: "store",
    id: "queenanne",
    storeId: "queenanne",
    time: "11:00 AM",
    timeMinutes: 11 * 60,
    travelFrom: "Elliott Bay Book Co.",
    travelTime: "10 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=1521%2010th%20Ave%2C%20Seattle%2C%20WA&destination=1811%20Queen%20Anne%20Ave%20N%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "charlies",
    storeId: "charlies",
    time: "11:20 AM",
    timeMinutes: 11 * 60 + 20,
    travelFrom: "Queen Anne Book Co.",
    travelTime: "10 min drive (opens 11am)",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=1811%20Queen%20Anne%20Ave%20N%2C%20Seattle%2C%20WA&destination=465%20N%2036th%20St%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "meal",
    id: "sun-lunch",
    time: "11:35 AM",
    timeMinutes: 11 * 60 + 35,
    label: "LUNCH in Fremont",
    description: "~20 minutes",
    duration: 20,
  },
  {
    type: "transit",
    id: "sun-transit-downtown",
    time: "12:10 PM",
    timeMinutes: 12 * 60 + 10,
    label: "Drive to downtown",
    description: "15 min drive to Pioneer Square",
  },
  {
    type: "store",
    id: "beguiled",
    storeId: "beguiled",
    time: "12:20 PM",
    timeMinutes: 12 * 60 + 20,
    travelFrom: "Fremont",
    travelTime: "15 min drive (opens 11am)",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=465%20N%2036th%20St%2C%20Seattle%2C%20WA&destination=109%201st%20Ave%20S%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "arundel",
    storeId: "arundel",
    time: "12:33 PM",
    timeMinutes: 12 * 60 + 33,
    travelFrom: "Beguiled Books",
    travelTime: "3 min walk",
    directionMode: "walking",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=109%201st%20Ave%20S%2C%20Seattle%2C%20WA&destination=322%201st%20Ave%20S%2C%20Seattle%2C%20WA&travelmode=walking",
  },
  {
    type: "store",
    id: "openbooks",
    storeId: "openbooks",
    time: "12:49 PM",
    timeMinutes: 12 * 60 + 49,
    travelFrom: "Arundel Books",
    travelTime: "6 min walk (opens noon, closes 4pm!)",
    directionMode: "walking",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=322%201st%20Ave%20S%2C%20Seattle%2C%20WA&destination=108%20Cherry%20St%2C%20Seattle%2C%20WA&travelmode=walking",
  },
  {
    type: "store",
    id: "leftbank",
    storeId: "leftbank",
    time: "1:05 PM",
    timeMinutes: 13 * 60 + 5,
    travelFrom: "Open Books",
    travelTime: "6 min walk (closes 5pm!)",
    directionMode: "walking",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=108%20Cherry%20St%2C%20Seattle%2C%20WA&destination=92%20Pike%20St%2C%20Seattle%2C%20WA&travelmode=walking",
  },
  {
    type: "store",
    id: "magnolias",
    storeId: "magnolias",
    time: "1:30 PM",
    timeMinutes: 13 * 60 + 30,
    travelFrom: "Left Bank Books",
    travelTime: "15 min drive (opens noon)",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=92%20Pike%20St%2C%20Seattle%2C%20WA&destination=3206%20W%20McGraw%20St%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "booklarder",
    storeId: "booklarder",
    time: "1:50 PM",
    timeMinutes: 13 * 60 + 50,
    travelFrom: "Magnolia's Bookstore",
    travelTime: "10 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=3206%20W%20McGraw%20St%2C%20Seattle%2C%20WA&destination=4252%20Fremont%20Ave%20N%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "secretgarden",
    storeId: "secretgarden",
    time: "2:10 PM",
    timeMinutes: 14 * 60 + 10,
    travelFrom: "Book Larder",
    travelTime: "10 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=4252%20Fremont%20Ave%20N%2C%20Seattle%2C%20WA&destination=2214%20NW%20Market%20St%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "wiseowl",
    storeId: "wiseowl",
    time: "2:30 PM",
    timeMinutes: 14 * 60 + 30,
    travelFrom: "Secret Garden Books",
    travelTime: "10 min drive (closes 5pm!)",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=2214%20NW%20Market%20St%2C%20Seattle%2C%20WA&destination=2223%20N%2056th%20St%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "couthbuzzard",
    storeId: "couthbuzzard",
    time: "2:45 PM",
    timeMinutes: 14 * 60 + 45,
    travelFrom: "The Wise Owl Books & Music",
    travelTime: "5 min drive",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=2223%20N%2056th%20St%2C%20Seattle%2C%20WA&destination=8310%20Greenwood%20Ave%20N%2C%20Seattle%2C%20WA&travelmode=driving",
  },
  {
    type: "store",
    id: "phinneybooks",
    storeId: "phinneybooks",
    time: "2:58 PM",
    timeMinutes: 14 * 60 + 58,
    travelFrom: "The Couth Buzzard",
    travelTime: "3 min drive — LAST STORE!",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=8310%20Greenwood%20Ave%20N%2C%20Seattle%2C%20WA&destination=7405%20Greenwood%20Ave%20N%2C%20Seattle%2C%20WA&travelmode=driving",
    lastStop: true,
  },
  {
    type: "home",
    id: "sun-home",
    time: "~3:10 PM",
    timeMinutes: 15 * 60 + 10,
    label: "Home",
    directionMode: "driving",
    directionUrl: "https://www.google.com/maps/dir/?api=1&origin=7405%20Greenwood%20Ave%20N%2C%20Seattle%2C%20WA&destination=7353%2019th%20Ave%20NW%2C%20Seattle%2C%20WA&travelmode=driving",
  },
];

// Contingency stores (not in either day's route)
export const contingencyStores = [
  "thirdplacelfp",
  "thirdplaceseward",
];

// Stores by day
export const saturdayStoreIds = saturdayRoute
  .filter(s => s.type === "store")
  .map(s => s.storeId);

export const sundayStoreIds = sundayRoute
  .filter(s => s.type === "store")
  .map(s => s.storeId);

// Saturday polyline coordinates (in order of visit)
export const saturdayPolyline = [
  [47.5992, -122.3338], // (Colman Dock approximate)
  [47.5654, -122.6326], // Ballast
  [47.7326, -122.6487], // Away With Words
  [47.7322, -122.6468], // Liberty Bay
  [47.6246, -122.5103], // Eagle Harbor
  [47.7985, -122.4943], // Saltwater
  // Ferry Kingston->Edmonds
  [47.8107, -122.3773], // East West
  [47.8103, -122.3770], // Edmonds Bookshop
  [47.7587, -122.3168], // Ridgecrest
  [47.6766, -122.2088], // BookTree
  [47.6696, -122.1216], // Brick & Mortar
  [47.5706, -122.2303], // Island Books
  [47.5468, -122.3226], // Fantagraphics
  [47.4670, -122.3458], // Page 2
  [47.4660, -122.3440], // Three Trees
  [47.5610, -122.3870], // Paper Boat
  [47.6685, -122.3130], // Nook & Cranny
  [47.6876, -122.2912], // Lovestruck
  [47.6741, -122.3116], // Third Place Ravenna
];

// Sunday polyline coordinates
export const sundayPolyline = [
  [47.6151, -122.2870], // Madison Books
  [47.6144, -122.3128], // Ada's
  [47.6148, -122.3197], // Elliott Bay
  [47.6366, -122.3569], // Queen Anne
  [47.6520, -122.3510], // Charlie's
  [47.6002, -122.3340], // Beguiled
  [47.5992, -122.3338], // Arundel
  [47.6030, -122.3310], // Open Books
  [47.6088, -122.3403], // Left Bank
  [47.6390, -122.3990], // Magnolia's
  [47.6586, -122.3501], // Book Larder
  [47.6687, -122.3844], // Secret Garden
  [47.6719, -122.3400], // Wise Owl
  [47.6902, -122.3558], // Couth Buzzard
  [47.6818, -122.3561], // Phinney Books
];

// Ferry routes for map display
export const ferryRoutes = [
  {
    id: "seattle-bremerton",
    name: "Seattle → Bremerton",
    coords: [
      [47.6025, -122.3384], // Colman Dock
      [47.5654, -122.6200], // midpoint
      [47.5654, -122.6326], // Bremerton terminal
    ],
  },
  {
    id: "kingston-edmonds",
    name: "Kingston → Edmonds",
    coords: [
      [47.7985, -122.4943], // Kingston terminal
      [47.8050, -122.4400], // midpoint
      [47.8107, -122.3850], // Edmonds terminal
    ],
  },
];
