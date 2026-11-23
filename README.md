# COURTWISE AI — Prototype 0.1

## Included
- GURU baseline PPG/PAPG projection
- Manual injury/fatigue point adjustments
- Last-10 venue-matched extreme-score panels
- Paste/import validation for basketball results
- Sportsbook line movement and normalized implied probabilities
- Local prediction history and CSV exports
- Installable PWA shell / offline cache

## Run locally
Open `index.html` in a modern browser. For installability/offline caching, serve this folder over HTTPS (or localhost). On Android Chrome, open the hosted HTTPS address, tap the browser menu, then **Install app** or **Add to Home screen**.

## Important limitations
This is a manual-first prototype. It does not connect to live league tables, injury feeds, player minutes, official results APIs, or SportyBet. It does not scrape private bookmaker endpoints. Imported scores are structurally validated but not independently authenticated. Keep each team's records restricted to the same competition and season before calculating extremes.

The current Extreme Engine uses:
- RED: last 10 matches where the selected home team was the away side; maximum combined total, maximum points scored by that team, maximum points conceded.
- YELLOW: last 10 matches where the selected away team was the home side; minimum combined total, minimum points scored by that team, minimum points conceded.

The UI displays the available sample count and does not fabricate missing matches. This is a prototype, not a calibrated betting model or a guarantee of outcomes.
