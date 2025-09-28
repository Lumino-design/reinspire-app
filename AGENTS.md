# Re-In Spire: Agent Development Blueprint

## 1. Core Vision & Philosophy
The app is a serene, minimalist breathwork training tool named "Re-In Spire." The design philosophy is "Serene Biofeedback," focusing on a dark, calm, and focused user experience. The primary goal is to help users improve CO2 tolerance and regulate their nervous system through guided exercises.

## 2. Technical Stack
- **Framework:** React with TypeScript
- **Styling:** TailwindCSS
- **Data Storage:** Browser `localStorage` only. No backend, no user accounts.
- **Goal:** A single-page, self-contained web application.

## 3. Phase 1: The Simplified MVP

Our first goal is to build a functional prototype with three core features.

### Feature 1: The Sanctuary (Home Screen)
- A single screen that is the main entry point.
- It should have a dark, calming background (e.g., `#0b1022`).
- It will display the user's "Last Relaxed Pause" and their current "Streak."
- It will have a large, clear button to "Start Today's Session."

### Feature 2: Relaxed Pause (RP) Calibration
- A guided process to measure the user's comfortable breath-hold time after a normal exhale.
- This will be a simple timer that the user starts and stops.
- The result (in seconds) must be saved to `localStorage`.

### Feature 3: The Core Training Session
- This feature is a "CO2 Tolerance Table" based on the user's saved RP.
- **Logic:**
  - The session consists of 5 rounds.
  - The `rest_duration` is fixed at 20 seconds for all rounds.
  - The `hold_duration` increases with each round:
    - Round 1 Hold: `RP - 4s`
    - Round 2 Hold: `RP - 2s`
    - Round 3 Hold: `RP`
    - Round 4 Hold: `RP + 2s`
    - Round 5 Hold: `RP + 4s`
- The UI should be minimal: a display for the current phase ("Breathe" or "Hold"), a countdown timer, and a progress indicator (e.g., "Round 3 of 5").
- The session must be stoppable at any time.

## 4. Development Plan
The agent's first task is to build a fully functional version of this Phase 1 MVP. The code should be well-structured, with clear components for each feature.