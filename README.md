# Wayfinder · Wilderness Expedition Planner & Field Dashboard

A single-expedition tactical planner and emergency-ready field dashboard built for backcountry trekking, wilderness fishing, and outdoor excursions. Built with zero recurring API or cloud hosting costs ($0 dev cost) for private and family use.

![Wayfinder Banner](src/assets/images/hero_expedition_mountain_1792100064188.jpg)

## Features

- **Briefing Intake (Onboarding)**:
  - Expedition name, type (*backcountry trek, alpine climb, wilderness fishing, canoe trip*), dates, duration, and overdue check-in cutoff time.
  - OpenStreetMap Nominatim coordinate lookup ($0 / no API key).
  - Trailhead start, parking notes, and vehicle details (*make/model, color, license plate, state*) for Search & Rescue vehicle identification.
  - Team roster with direct mobile contacts, next-of-kin emergency contacts (ICE), blood types, and medical/allergy notes.
  - Local authority lines (*ranger station, 24/7 County Sheriff Search & Rescue dispatch, nearest hospital emergency room*).
- **Tactical Field Dashboard**:
  - **High-Level Briefing Strip**: Countdown timer, duration window, accounted team roster, and overall gear packed percentage.
  - **3-Day Open-Meteo Weather Engine**: High-resolution daily forecasts (high/low temps in °F/°C, rain probabilities, wind gusts, UV index) with automated tactical field protocols (*freeze protection, lightning drills, high wind advice*).
  - **Expandable Emergency Contacts Center**: Member cards expandable on click with full medical notes, one-tap phone dialing (`tel:`), and emergency SMS dispatch (`sms:`).
  - **Apple iOS Location Share Beacon**: Native W3C Geolocation integration that acquires live device GPS coordinates and triggers the iOS Web Share Sheet, broadcasting interactive Apple Maps coordinate links (`https://maps.apple.com/?ll=lat,lon`) to family or rangers without third-party subscriptions.
  - **Interactive Leaflet Map**: Topographic and satellite/street map views with custom tactical markers for the Trailhead Start, Vehicle Parking Staging Area, Ranger Stations, and County SAR base.
  - **Interactive Checklist Manager**: Filterable by category (*Provisions, Gear, Chargers & Power, Medical & Survival*), item check/uncheck toggles, and inline gear additions.
  - **Regional Wilderness Bulletin**: Regional outdoor advisories, active wildfire fire-ban restrictions, and wildlife/bear canister alerts tailored to the expedition type.
- **Printable SAR Emergency Manifest**:
  - One-click, high-contrast wilderness trip plan formatted for search-and-rescue filing or leaving on your vehicle dashboard at the trailhead.
- **Theme**: Seamless Light / Dark mode toggle with high-contrast field legibility.
- **Data Persistence**: LocalStorage persistence with offline caching and $0 hosting overhead.

---

## Local Development Setup

### Prerequisites
- Node.js 18+ or 20+
- npm or bun

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
```

The production output is generated in the `dist/` directory.

---

## Deploying to Netlify ($0 Free Tier)

1. Connect your GitHub repository to [Netlify](https://www.netlify.com/).
2. Select repository: `Wayfinder`.
3. Set build configuration:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Deploy! Your app will deploy in seconds with free SSL and automated continuous deployments on every `git push`.
