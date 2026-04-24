# IBD 2026 Route Planner — Session Handoff

**Repo:** https://github.com/Meemo1/bookstore-day-planner  
**Dev server:** `npm run dev` from project root → localhost:5173

## What this is

A mobile-first React SPA for planning a Seattle Independent Bookstore Day crawl on April 25–26, 2026. Emily and Iris visit ~33 bookstores across two days. Tracks visited/skipped stores, wishlist books, and purchases (PIN-locked cost view). All state in localStorage — no backend.

## Tech stack

React 19 · Vite 5 · Tailwind CSS v3 · Leaflet/react-leaflet v5 · lucide-react · canvas-confetti  
Google Fonts: Fraunces (display/`font-display`), Figtree (body), JetBrains Mono

## Key files

```
src/
  App.jsx                  — root, header, section routing, confetti milestones
  hooks/useAppState.js     — all state + localStorage persistence
  components/
    StopCard.jsx           — store card (visited/skipped/current states + logo thumbnail)
    ItineraryView.jsx      — scrollable day route list
    MapView.jsx            — Leaflet map with numbered markers
    WishlistView.jsx       — book wishlist, Emily + Iris tabs
    HaulView.jsx           — purchase log, PIN-locked cost totals
    FerryCard.jsx          — ferry cards with live departure countdown
  data/
    stores.js              — store definitions (id, name, address, lat/lng, hours, website)
    routes.js              — ordered Sat + Sun routes (stores, ferries, meals, transit stops)
public/
  store-images/            — 28 store logos (.png/.jpg) served statically
  ibd-logo-2026.png        — IBD 2026 seal used as tiled page background
```

## Design system (tailwind.config.js)

```js
colors: {
  navy:  { darkest:'#0E1A27', deep:'#162234', raised:'#1E2E42', border:'#2A3E58',
           DEFAULT:'#1B3A5C', light:'#2860A0', hover:'#3474B8' },
  cream: { white:'#FEFCF7', DEFAULT:'#FDF8F0', page:'#F4EEE4',
           border:'#E8D8C0', deep:'#DFD0B8' },
  ink:   { 900:'#1A1510', 700:'#2E2416', 500:'#6A5848', 300:'#A89280', 100:'#D4C8BA' },
  amber: { dark:'#8A5010', DEFAULT:'#C4752A', border:'#E8B870', tint:'#FEF3E6' },
  teal:  { DEFAULT:'#1D6B4A', border:'#8CCDB0', tint:'#E6F5EF' },
  gold:  { DEFAULT:'#D4A030', tint:'#FDF8E8' },
  ferry: '#0891b2',   // ← keep distinct from navy, used only for ferry UI
}
```

**Dark mode:** Tailwind `class` strategy — `html.dark` toggled by `useAppState`.

## State shape (localStorage key: `ibd2026_planner`)

```js
{
  visitedStores: [],        // storeId strings
  skippedStores: [],
  notes: {},                // { storeId: string }
  activeDay: 'saturday',    // 'saturday' | 'sunday' | 'contingency'
  activeView: 'itinerary',  // 'itinerary' | 'map'
  activeSection: 'route',   // 'route' | 'wishlist' | 'haul'
  darkMode: false,
  wishlists: {
    emily: [{ id, title, author, gotIt }],
    iris:  [{ id, title, author, gotIt }],
  },
  purchases: {
    storeId: [{ id, item, cost }],
  },
}
```

`addWishlistItem(person, title, author)` lives in `useAppState.js`. The wishlist item shape will need a `thumbnail` field added for the next feature.

## Tiled background

The IBD logo tiles at ~7% opacity on the root div using a CSS multi-layer background: a 93%-opaque gradient overlay sits on top of the tile layer. Opaque card children naturally cover the tiles; only gaps between cards show the pattern. Implemented as an inline `style` on the root `<div>` in `App.jsx` — no separate element needed.

## Store thumbnails (StopCard.jsx)

`StoreThumbnail` tries `/store-images/{storeId}.png`, falls back to `.jpg`, then silently hides. 28 of 34 store IDs have logos. Missing (sites were JS-rendered, blocked, or TLS errors): adas, arundel, awaywithwords, couthbuzzard, fantagraphics, madisonbooks, nookcranny.

---

## Next feature: Amazon URL → wishlist card auto-fill

**Goal:** User pastes an Amazon book URL into the title field; app auto-populates title, author, and cover thumbnail.

**Implementation — no backend needed:**

1. Detect Amazon URL in the title `<input>` (onChange)
2. Extract ASIN: `url.match(/\/dp\/([A-Z0-9]{10})/)?.[1]`
3. If ASIN doesn't start with `B0` (i.e. it's an ISBN-10), query Google Books:
   ```
   https://www.googleapis.com/books/v1/volumes?q=isbn:{asin}&maxResults=1
   ```
   No API key required. Returns `items[0].volumeInfo.{ title, authors, imageLinks.thumbnail }`.
4. Replace `http://` with `https://` on the thumbnail URL (Google Books returns http).
5. Pre-fill title + author fields; store `thumbnail` URL on the wishlist item.
6. For Kindle ASINs (`B0...`) — not an ISBN, Google Books won't find them. Show a small inline message and let user type manually.

**Files to change:**
- `src/hooks/useAppState.js` — add optional `thumbnail` param to `addWishlistItem`; include in item shape
- `src/components/WishlistView.jsx`:
  - Add URL detection + `fetch` + loading state to the add form
  - Render `item.thumbnail` as a small cover image (~48px tall, `object-cover`) in `WishlistItem`
  - Existing items without thumbnails just show none — backwards compatible

**UX:** paste URL → spinner → fields populate. If fetch fails, fields stay editable.
