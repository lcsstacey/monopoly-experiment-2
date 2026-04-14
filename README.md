# Monopoly — Family Edition

A polished browser-based Monopoly experience built for local multiplayer (hot-seat) sessions with friends and family.

## Highlights

- Modern premium UI with motion-focused design language.
- Local multiplayer for **2 to 6 players**.
- Core Monopoly flow: buy properties, pay rent, taxes, utilities/railroads, chance cards, jail, elimination.
- Monopoly bonus rent (full color-set ownership doubles base property rent).
- Free Parking pot house rule.

## Interactive systems

- **Spatial UI tilt/parallax**: board and sidebar respond to pointer movement.
- **3D-like web scene effect**: a dynamic canvas particle field reacts to pointer position.
- **Motion toggle** for accessibility/performance preference.
- Optional low-key generated jazz background toggle.

## Quality of life

- Keyboard shortcuts (`R` roll, `E` end turn).
- Autosave + manual save to `localStorage`.
- Quick rules modal and activity log controls.

## Desktop distribution (Electron)

This repo now includes an Electron wrapper so you can package the game as a desktop app (`.exe` on Windows).

### Setup

```bash
npm install
```

### Run locally as desktop app

```bash
npm run start
```

### Build distributables

```bash
npm run dist       # Builds for current OS
npm run dist:win   # Windows NSIS installer (.exe)
npm run dist:mac   # macOS DMG
npm run dist:linux # Linux AppImage
```

Build outputs are generated in `dist/`.

## Steam readiness checklist

For Steam release, this project now covers the desktop packaging baseline. You should still complete:

1. Create Steamworks app and upload builds via SteamPipe.
2. Add platform icons, installer branding, and legal metadata.
3. Add crash reporting and analytics.
4. Perform QA on clean Windows machines and gamepad input if desired.
5. Prepare store assets (capsules, trailers, screenshots) and age ratings if applicable.

## Browser run (no build)

You can still run without Electron:

1. Open `index.html` directly in a browser, or run a static server:
   - `python3 -m http.server 8080`
2. Visit `http://localhost:8080`
3. Configure player names and start.
