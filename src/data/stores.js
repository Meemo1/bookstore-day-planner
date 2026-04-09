export const HOME = { lat: 47.6826, lng: -122.3854, name: "Home", address: "7353 19th Ave NW, Seattle" };

export const stores = [
  { id: "adas", name: "Ada's Technical Books", address: "425 15th Ave. E, Seattle", lat: 47.6144, lng: -122.3128, region: "Capitol Hill", hours: { sat_ibd: "8am-8pm", sun: "8am-8pm" }, website: "adastechbooks.com", new2026: false },
  { id: "arundel", name: "Arundel Books", address: "322 1st Ave. S, Seattle", lat: 47.5992, lng: -122.3338, region: "Pioneer Square", hours: { sat_ibd: "9am-9pm", sun: "10am-8pm" }, website: "arundelbooks.com", new2026: false },
  { id: "awaywithwords", name: "Away With Words", address: "18954 Front St NE #100, Poulsbo", lat: 47.7326, lng: -122.6487, region: "Kitsap", hours: { sat_ibd: "8am-7pm", sun: "10am-6pm" }, website: "awaywithwordsbookshop.com", new2026: false, ferry: true },
  { id: "ballast", name: "Ballast Book Co.", address: "409 Pacific Ave., Ste. 202, Bremerton", lat: 47.5654, lng: -122.6326, region: "Kitsap", hours: { sat_ibd: "8am-8pm", sun: "10am-7pm" }, website: "ballastbookco.com", new2026: false, ferry: true },
  { id: "beguiled", name: "Beguiled Books", address: "109 1st Ave S, Seattle", lat: 47.6002, lng: -122.3340, region: "Pioneer Square", hours: { sat_ibd: "11am-8pm", sun: "11am-4pm" }, website: "beguiledbooks.com", new2026: true },
  { id: "booklarder", name: "Book Larder", address: "4252 Fremont Ave. N, Seattle", lat: 47.6586, lng: -122.3501, region: "Fremont", hours: { sat_ibd: "10am-6pm", sun: "10am-6pm" }, website: "booklarder.com", new2026: false },
  { id: "booktree", name: "BookTree", address: "609 Market Street, Kirkland", lat: 47.6766, lng: -122.2088, region: "Eastside", hours: { sat_ibd: "11am-7pm", sun: "12pm-5pm" }, website: "booktreekirkland.com", new2026: false },
  { id: "brickmortar", name: "Brick & Mortar Books", address: "7430 164th Ave. NE, Ste B105, Redmond", lat: 47.6696, lng: -122.1216, region: "Eastside", hours: { sat_ibd: "10am-8pm", sun: "11am-7pm" }, website: "brickandmortarbooks.com", new2026: false },
  { id: "charlies", name: "Charlie's Queer Books", address: "465 N. 36th St., Seattle", lat: 47.6520, lng: -122.3510, region: "Fremont", hours: { sat_ibd: "11am-7pm", sun: "11am-5pm" }, website: "charliesqueerbooks.com", new2026: false },
  { id: "eagleharbor", name: "Eagle Harbor Book Co.", address: "157 Winslow Way E, Bainbridge Island", lat: 47.6246, lng: -122.5103, region: "Kitsap", hours: { sat_ibd: "8am-7pm", sun: "10am-6pm" }, website: "eagleharborbooks.com", new2026: false, ferry: true },
  { id: "eastwest", name: "East West Books & Gifts", address: "110 3rd Ave N STE 102, Edmonds", lat: 47.8107, lng: -122.3773, region: "Edmonds", hours: { sat_ibd: "10am-6pm", sun: "12pm-5pm" }, website: "eastwestseattle.org", new2026: true },
  { id: "edmondsbookshop", name: "Edmonds Bookshop", address: "111 Fifth Avenue South, Edmonds", lat: 47.8103, lng: -122.3770, region: "Edmonds", hours: { sat_ibd: "10am-8pm", sun: "11am-5pm" }, website: "edmondsbookshop.com", new2026: false },
  { id: "elliottbay", name: "Elliott Bay Book Co.", address: "1521 10th Ave., Seattle", lat: 47.6148, lng: -122.3197, region: "Capitol Hill", hours: { sat_ibd: "9am-10pm", sun: "9am-10pm" }, website: "elliottbaybook.com", new2026: false },
  { id: "fantagraphics", name: "Fantagraphics Bookstore", address: "1201 S Vale St., Seattle", lat: 47.5468, lng: -122.3226, region: "Georgetown", hours: { sat_ibd: "11:30am-8pm", sun: "11:30am-5pm" }, website: "fantagraphics.com/bookstore", new2026: false },
  { id: "islandbooks", name: "Island Books", address: "3014 78th Ave. SE, Mercer Island", lat: 47.5706, lng: -122.2303, region: "Eastside", hours: { sat_ibd: "8am-6:30pm", sun: "9am-5pm" }, website: "islandbooks.com", new2026: false },
  { id: "leftbank", name: "Left Bank Books Collective", address: "92 Pike St., Seattle", lat: 47.6088, lng: -122.3403, region: "Pike Place", hours: { sat_ibd: "12pm-5pm", sun: "12pm-5pm" }, website: "leftbankbooks.com", new2026: false, notes: "Closes 5pm! Thu-Fri (May 1-2) CLOSED for May Day", timeSensitive: true },
  { id: "libertybay", name: "Liberty Bay Books", address: "18881 D Front St NE, Poulsbo", lat: 47.7322, lng: -122.6468, region: "Kitsap", hours: { sat_ibd: "8am-7pm", sun: "10am-5pm" }, website: "libertybaybooks.com", new2026: false, ferry: true },
  { id: "lovestruck", name: "Lovestruck in Seattle", address: "8507 35th Ave. NE, Seattle", lat: 47.6876, lng: -122.2912, region: "Wedgwood", hours: { sat_ibd: "10am-7pm", sun: "10am-5pm" }, website: "lovestruckinseattle.com", new2026: true },
  { id: "madisonbooks", name: "Madison Books", address: "4118 E. Madison St., Seattle", lat: 47.6151, lng: -122.2870, region: "Madison Valley", hours: { sat_ibd: "10am-6pm", sun: "10am-6pm" }, website: "madisonbx.com", new2026: false },
  { id: "magnolias", name: "Magnolia's Bookstore", address: "3206 W. McGraw St., Seattle", lat: 47.6390, lng: -122.3990, region: "Magnolia", hours: { sat_ibd: "9am-6pm", sun: "12pm-5pm" }, website: "magnoliasbookstore.com", new2026: false, notes: "Sun opens at noon" },
  { id: "nookcranny", name: "Nook & Cranny Books", address: "5637 University Way NE, Seattle", lat: 47.6685, lng: -122.3130, region: "U District", hours: { sat_ibd: "9am-8pm", sun: "9am-6pm" }, website: "nookandcrannybooks.com", new2026: false },
  { id: "openbooks", name: "Open Books: A Poem Emporium", address: "108 Cherry St., Seattle", lat: 47.6030, lng: -122.3310, region: "Chinatown-ID", hours: { sat_ibd: "12pm-5pm", sun: "12pm-4pm" }, website: "openpoetrybooks.com", new2026: false, notes: "Closes early! Poetry bookstore. Sun closes 4pm!", timeSensitive: true },
  { id: "page2", name: "Page 2 Books", address: "560 SW 152nd St., Burien", lat: 47.4670, lng: -122.3458, region: "Burien", hours: { sat_ibd: "10am-7pm", sun: "10am-6pm" }, website: "page2books.com", new2026: false },
  { id: "paperboat", name: "Paper Boat Booksellers", address: "4522 California Ave. SW, Seattle", lat: 47.5610, lng: -122.3870, region: "West Seattle", hours: { sat_ibd: "10am-8pm", sun: "10am-5pm" }, website: "paperboatbooksellers.com", new2026: false },
  { id: "phinneybooks", name: "Phinney Books", address: "7405 Greenwood Ave. N, Seattle", lat: 47.6818, lng: -122.3561, region: "Phinney Ridge", hours: { sat_ibd: "10am-7pm", sun: "12pm-5pm" }, website: "phinneybooks.com", new2026: false, notes: "Sun opens at noon" },
  { id: "queenanne", name: "Queen Anne Book Co.", address: "1811 Queen Anne Ave. N, Seattle", lat: 47.6366, lng: -122.3569, region: "Queen Anne", hours: { sat_ibd: "8am-8pm", sun: "10am-5pm" }, website: "qabookco.com", new2026: false },
  { id: "ridgecrest", name: "Ridgecrest Books", address: "512 NE 165th St., Shoreline", lat: 47.7587, lng: -122.3168, region: "Shoreline", hours: { sat_ibd: "11am-7pm", sun: "11am-7pm" }, website: "ridgecrestbookstore.com", new2026: false },
  { id: "saltwater", name: "Saltwater Bookshop", address: "10978 NE State Hwy 104 Ste 109, Kingston", lat: 47.7985, lng: -122.4943, region: "Kitsap", hours: { sat_ibd: "8am-6pm", sun: "9am-4pm" }, website: "saltwaterbookshop.com", new2026: false, ferry: true },
  { id: "secretgarden", name: "Secret Garden Books", address: "2214 NW Market St., Seattle", lat: 47.6687, lng: -122.3844, region: "Ballard", hours: { sat_ibd: "10am-6pm", sun: "10am-5pm" }, website: "secretgardenbooks.com", new2026: false },
  { id: "couthbuzzard", name: "The Couth Buzzard", address: "8310 Greenwood Ave. N, Seattle", lat: 47.6902, lng: -122.3558, region: "Greenwood", hours: { sat_ibd: "9am-9pm", sun: "9am-7pm" }, website: "couthbuzzard.com", new2026: true },
  { id: "wiseowl", name: "The Wise Owl Books & Music", address: "2223 N 56th St., Seattle", lat: 47.6719, lng: -122.3400, region: "Tangletown", hours: { sat_ibd: "10am-5pm", sun: "10am-5pm" }, website: "thewiseowlbooks.com", new2026: false, notes: "Closes 5pm!", timeSensitive: true },
  { id: "thirdplacelfp", name: "Third Place Books LFP", address: "17171 Bothell Way NE #A101, Lake Forest Park", lat: 47.7555, lng: -122.2808, region: "Lake Forest Park", hours: { sat_ibd: "9am-9pm", sun: "9am-9pm" }, website: "thirdplacebooks.com", new2026: false, notes: "Only need 1 of 3 Third Place locations", thirdPlace: true },
  { id: "thirdplaceravenna", name: "Third Place Books Ravenna", address: "6504 20th Ave. NE, Seattle", lat: 47.6741, lng: -122.3116, region: "Ravenna", hours: { sat_ibd: "9am-9pm", sun: "9am-9pm" }, website: "thirdplacebooks.com", new2026: false, notes: "Only need 1 of 3 Third Place locations", thirdPlace: true },
  { id: "thirdplaceseward", name: "Third Place Books Seward Park", address: "5041 Wilson Ave. S, Seattle", lat: 47.5518, lng: -122.2600, region: "Seward Park", hours: { sat_ibd: "9am-9pm", sun: "9am-9pm" }, website: "thirdplacebooks.com", new2026: false, notes: "Only need 1 of 3 Third Place locations", thirdPlace: true },
  { id: "threetrees", name: "Three Trees Books", address: "827 SW 152nd St., Burien", lat: 47.4660, lng: -122.3440, region: "Burien", hours: { sat_ibd: "10am-7pm", sun: "12pm-4pm" }, website: "threetreesbooks.com", new2026: false },
];

// The 33 stores in the planned route (excluding 2 of the 3 Third Place locations)
// We use Third Place Ravenna only
export const plannedStoreIds = stores
  .filter(s => s.id !== 'thirdplacelfp' && s.id !== 'thirdplaceseward')
  .map(s => s.id);

export const getStoreById = (id) => stores.find(s => s.id === id);

export const SATURDAY_DATE = "Saturday, April 25, 2026";
export const SUNDAY_DATE = "Sunday, April 26, 2026";
