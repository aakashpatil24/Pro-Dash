# ⚡ ProDash

**Productivity Dashboard — Browser-Based · No Backend · No Installation**

> Built by **Aakash Patil**

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![LocalStorage](https://img.shields.io/badge/LocalStorage-Persistent-4CAF50?style=for-the-badge&logo=databricks&logoColor=white)

---

## 📖 Table of Contents

1. [About](#-about)
2. [Features](#-features)
3. [File Structure](#-file-structure)
4. [Getting Started](#-getting-started)
5. [How It Works](#-how-it-works)
6. [APIs Used](#-apis-used)
7. [Module Breakdown](#-module-breakdown)
8. [Local Storage Schema](#-local-storage-schema)
9. [Tech Stack](#-tech-stack)
10. [Responsive Breakpoints](#-responsive-breakpoints)
11. [Known Limitations](#-known-limitations)
12. [Future Enhancements](#-future-enhancements)
13. [License](#-license)
14. [Author](#-author)

---

## 🧠 About

ProDash runs **entirely in the browser** — no server, no database, no install required.  
Data persists via `localStorage`. Built with plain HTML, CSS & Vanilla JavaScript.

> **Goal:** Bring all daily productivity tools — tasks, planning, focus, motivation, and weather — into one clean, fast, single-page app.

---

## ✨ Features

### 🧭 Dashboard Navigation

| Feature | Details |
|---|---|
| Feature Cards | 6 clickable cards — one per tool |
| Single Panel View | One feature opens at a time, no page reload |
| Back Button | Always visible below top bar to return to dashboard |
| Active State | Only one feature section visible at a time |
| Data-Target Routing | Single reusable handler — no separate logic per card |

---

### 📝 Todo List

| Feature | Details |
|---|---|
| Add Tasks | Input field + Add button + Enter key support |
| Complete | Circle checkbox toggles done state with strikethrough |
| Important | Star toggle — highlights task with accent border |
| Delete | Trash button per task |
| Filters | All · Active · Completed · Important |
| Clear | One-click clear all completed tasks |
| Persistence | Full list saved to localStorage on every change |
| Count Badge | Live task count shown on dashboard card |

---

### 📅 Daily Planner

| Feature | Details |
|---|---|
| Time Slots | Hourly blocks from 6 AM to 11 PM |
| Add Notes | Text input per slot — type and save |
| Auto Save | Saves on blur (when user leaves input) |
| Current Hour | Auto-highlighted and scrolled into view |
| Clear Slot | Per-slot clear button |
| Clear All | Wipe entire day's plan with confirmation |
| Persistence | All entries saved to localStorage |

---

### ⏱ Pomodoro Timer

| Feature | Details |
|---|---|
| Work Session | 25 minutes default |
| Short Break | 5 minutes |
| Long Break | 15 minutes |
| Controls | Start · Pause · Reset |
| SVG Ring | Animated circular progress ring |
| Session Count | Tracks and displays session number |
| Completion Alert | In-app message + browser notification |
| Guard | Prevents multiple intervals from running |

---

### 💬 Daily Quote

| Feature | Details |
|---|---|
| Live Fetch | Fetches random quote from Quotable.io on open |
| New Quote | Button to fetch fresh quote anytime |
| Loading State | Spinner shown while request is in flight |
| Offline Fallback | 8 hardcoded quotes used if API fails |
| Copy | One-click copy quote to clipboard |
| Author | Quote author displayed below text |

---

### 🌦 Weather Widget

| Feature | Details |
|---|---|
| Auto Location | Uses Geolocation API to detect user location |
| City Search | Manual city search if location is denied |
| Temperature | Current temp in °C |
| Condition | Weather description + emoji icon |
| Details | Humidity · Wind speed · Feels like · Visibility |
| Mini Pill | Always-visible weather in top bar |
| No Key Needed | Open-Meteo API — completely free, no signup |
| Cache | Re-uses fetched data within same session |

---

### 🕐 Date & Time

| Feature | Details |
|---|---|
| Live Clock | Updates every second |
| 12-Hour Format | AM/PM display with leading zeros |
| Full Date | Day name · Date · Month · Year |
| Always Visible | Lives in the persistent top bar |
| Greeting | Changes dynamically — Morning / Afternoon / Evening / Night |

---

### 🌅 Dynamic Background

| Feature | Details |
|---|---|
| Morning | 5 AM – 11 AM |
| Afternoon | 12 PM – 4 PM |
| Evening | 5 PM – 8 PM |
| Night | 9 PM – 4 AM |
| Image Support | Loads from `assets/backgrounds/` folder |
| Gradient Fallback | CSS gradient used if image is missing |
| Auto Refresh | Re-checks every 10 minutes |
| Overlay | Translucent overlay keeps text readable on all backgrounds |

---

### 🌙 Theme Switch

| Feature | Details |
|---|---|
| Light Mode | Default theme |
| Dark Mode | Full dark color palette via CSS variables |
| Toggle | Sun/Moon button in top bar |
| Persistence | Saved to localStorage |
| No Flash | Inline script in `<head>` applies theme before first paint |

---

### 🎯 Daily Goals

| Feature | Details |
|---|---|
| Add Goals | Input + Add button + Enter key |
| Toggle Done | Square checkbox marks goal complete |
| Delete | Trash button per goal |
| Progress Bar | Live gradient bar — grows as goals are completed |
| Progress Text | "2 of 5 goals completed" |
| Percentage | Live % shown alongside progress bar |
| Clear | One-click clear all completed goals |
| Persistence | Full list saved to localStorage on every change |

---

## 📁 File Structure

```
prodash/
├── index.html              # All sections and layout — single file
├── style.css               # CSS variables, themes, layout, responsive
├── script.js               # All logic — 10 modules + single init()
├── README.md
└── assets/
    ├── icons/              # SVG icons for cards and UI
    │   ├── dashboard.svg   # App logo
    │   ├── todo.svg
    │   ├── planner.svg
    │   ├── pomodoro.svg
    │   ├── quote.svg
    │   ├── weather.svg
    │   └── goals.svg
    └── backgrounds/        # Time-of-day background images
        ├── morning.jpg
        ├── afternoon.jpg
        ├── evening.jpg
        └── night.jpg
```

---

## 🏁 Getting Started

No installs. No server. No API keys.

```
git clone https://github.com/yourusername/prodash.git
cd prodash
open index.html
```

> Just open `index.html` in any modern browser — Chrome, Firefox, Edge, Safari.

---

## 🔄 How It Works

### Navigation Flow

```
Dashboard → Click Card → Feature Panel Opens → Interact → Save → Back → Dashboard
```

Every feature follows this same loop. `Navigation.open(name)` handles all routing via `data-target` attributes — one reusable function for all 6 features.

### Data Flow

```
User Action → Update STATE → Save to localStorage → Re-render DOM
```

State is always the source of truth. DOM is always rebuilt from state — nothing goes out of sync.

### Theme Application

```
Page Load → Read localStorage → Apply data-theme on <html> → CSS variables update everything
```

The inline `<script>` in `<head>` applies the saved theme before the page renders — zero flash.

### Weather Flow

```
Page Load → Geolocation API → Open-Meteo API (weather) + Nominatim (city name) → Display
City Denied → Show search input → User types city → Open-Meteo Geocoding → Coordinates → Weather
```

---

## 🌐 APIs Used

| API | Purpose |
|---|---|
| [Open-Meteo](https://open-meteo.com) | Live weather data |
| [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) | City name → coordinates |
| [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org) | Coordinates → city name (reverse geocoding) |
| [Quotable.io](https://api.quotable.io/random) | Random motivational quotes |

> **All APIs are completely free — no signup, no API key, no rate limit concerns for personal use.**

---

## 🧩 Module Breakdown

All logic lives in `script.js`, organized into clean named modules:

| Module | Responsibility |
|---|---|
| `CONFIG` | API URLs · Pomodoro durations · Weather codes · Fallback quotes · localStorage keys |
| `STATE` | Single shared app state object — todos · goals · planner · pomodoro · cache |
| `DOM` | All element references cached once on load via `cacheDOM()` |
| `Helpers` | `lsGet` · `lsSet` · `escapeHTML` · `formatTime` · `randomFrom` |
| `Navigation` | `open(name)` · `close()` · card click routing · back button |
| `DateTimeModule` | Live clock · date formatting · greeting text · `setInterval` |
| `Background` | Time-of-day detection · image/gradient apply · 10-min re-check |
| `Theme` | Toggle light/dark · save to localStorage · apply on load |
| `Todo` | Add · complete · important · delete · filter · render · localStorage |
| `Planner` | Render slots · save on blur · highlight current hour · clear |
| `Goals` | Add · toggle · delete · progress bar · render · localStorage |
| `Pomodoro` | Countdown · SVG ring · Start/Pause/Reset · mode tabs · notifications |
| `Quote` | Fetch · fallback · display · copy to clipboard |
| `Weather` | Geolocation · city search · fetch · display · cache · mini pill |
| `init()` | Single entry point — wires everything on `DOMContentLoaded` |

---

## 🗄️ Local Storage Schema

```
localStorage
├── pdb_theme       "light" | "dark"
├── pdb_todos       [{ id, text, completed, important }]
├── pdb_goals       [{ id, text, completed }]
└── pdb_planner     { "06:00": "Morning run", "09:00": "Team standup", ... }
```

> All keys are prefixed with `pdb_` to avoid collisions with other apps.

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|---|---|---|
| HTML5 | App structure — all sections in one file | — |
| CSS3 | Styling · CSS Variables · Animations · Grid · Flexbox | — |
| JavaScript | All logic — DOM · Events · APIs · Timers | ES2022 |
| localStorage | Data persistence across sessions | Built-in |
| Geolocation API | Auto-detect user location for weather | Built-in |
| Notification API | Pomodoro session complete alert | Built-in |
| Clipboard API | Copy quote to clipboard | Built-in |

**Zero frameworks · Zero libraries · Zero build tools · Zero dependencies**

---

## 📱 Responsive Breakpoints

| Screen | Layout |
|---|---|
| Desktop > 768px | 3-column feature card grid · full top bar |
| Tablet 480–768px | 2-column card grid · compact top bar |
| Mobile < 480px | 2-column cards · stacked inputs · hidden logo text |

---

## ⚠️ Known Limitations

| Limitation | Reason |
|---|---|
| Browser-only data | No cross-device or cross-browser sync |
| Clearing localStorage wipes data | No cloud backup |
| Quotable.io may be slow | Free public API — fallback quotes handle this |
| Geolocation requires permission | Browser security — city search is the fallback |
| Backgrounds need image files | Gradient fallback used if images are absent |
| Notifications require permission | Browser must grant permission on first use |

---

## 🗺️ Future Enhancements

- [ ] PWA support — installable, works offline
- [ ] Drag and drop to reorder tasks and goals
- [ ] Pomodoro history and session stats
- [ ] Planner data reset at midnight automatically
- [ ] Multiple todo lists / categories
- [ ] Export tasks and goals as CSV
- [ ] Calendar view for planner
- [ ] Custom Pomodoro durations

---

## 📄 License

**MIT License — Copyright (c) 2026 Aakash Patil**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is provided to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

---

## 👤 Author

| Field | Details |
|---|---|
| Name | Aakash Patil |
| Organization | Sheryians Coding School |
| Project | ProDash — Productivity Dashboard |
| Type | Browser-based · No backend · No framework |
| Stack | HTML · CSS · Vanilla JavaScript |

**⚡ ProDash — Everything you need to own your day, in one screen.**
