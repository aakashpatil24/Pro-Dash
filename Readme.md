# ProDash — Productivity Dashboard

A single-page productivity web app built with vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies.

---

## Features

| Feature | Description |
|---|---|
| 📝 Todo List | Add, complete, star important tasks, filter by status |
| 📅 Daily Planner | Hourly time slots for the day, auto-highlights current hour |
| ⏱ Pomodoro Timer | 25/5/15 min work and break sessions with SVG ring progress |
| 💬 Daily Quote | Fetches live inspirational quotes with offline fallback |
| 🌦 Weather Widget | Live weather via OpenWeatherMap, geolocation or city search |
| 🕐 Date & Time | Live clock updated every second |
| 🌅 Dynamic Background | Background changes based on time of day |
| 🌙 Theme Switch | Light and dark mode, saved across sessions |
| 🎯 Daily Goals | Set goals, track progress with a live progress bar |

---

## Setup

### 1. Clone or Download

```
git clone https://github.com/yourusername/prodash.git
```

### 2. Get a Free Weather API Key

- Sign up at [openweathermap.org](https://openweathermap.org/api)
- Copy your API key

### 3. Add the Key

Open `script.js` and replace the placeholder:

```js
WEATHER_API_KEY: 'YOUR_OPENWEATHERMAP_API_KEY',
```

### 4. Open in Browser

```
open index.html
```

No build step, no npm install, no server required.

---

## File Structure

```
prodash/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── icons/
    │   ├── dashboard.svg
    │   ├── todo.svg
    │   ├── planner.svg
    │   ├── pomodoro.svg
    │   ├── quote.svg
    │   ├── weather.svg
    │   └── goals.svg
    └── backgrounds/
        ├── morning.jpg
        ├── afternoon.jpg
        ├── evening.jpg
        └── night.jpg
```

---

## Browser Features Used

- **Local Storage** — persists todos, goals, planner entries, and theme
- **Fetch API** — live weather and quote data from external APIs
- **Geolocation API** — auto-detects location for weather
- **setInterval** — powers the live clock and pomodoro countdown
- **Notification API** — alerts when a pomodoro session ends

---

## Local Storage Keys

| Key | Stores |
|---|---|
| `pdb_theme` | Selected theme (light/dark) |
| `pdb_todos` | Todo list array |
| `pdb_goals` | Daily goals array |
| `pdb_planner` | Planner entries object |

---

## Notes

- The Quote API (`api.quotable.io`) is free and requires no key
- If geolocation is denied, a city search input appears automatically
- All data persists across page refreshes via Local Storage
- Background images are optional — a CSS gradient fallback is used if images are missing

---

## License

MIT — free to use, modify, and distribute.
