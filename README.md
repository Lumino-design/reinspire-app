# Re-In Spire

A serene, single-page breathwork companion focused on relaxed pause calibration and daily CO2 tolerance training.

## Phase 1 MVP Features
- Sanctuary home view with last relaxed pause summary and streak tracking.
- Guided relaxed pause calibration timer with one-tap save to localStorage.
- Five-round CO2 tolerance session with timed breathe / hold phases and completion flow.

## Getting Started
1. Install dependencies: `npm install`.
2. Start the dev server: `npm run dev`.
3. Build for production: `npm run build`.

## Data Storage
All session data lives in browser `localStorage` under the `reinspire.*` keys. Clearing site data resets relaxed pause, streak, and history.

## Tech Stack
React 19 + TypeScript | Vite | Tailwind CSS 3.
