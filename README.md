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

This repo includes an Electron wrapper so you can package the game as a desktop app (`.exe` on Windows).

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

## Windows installer + signing (production path)

This repo now includes a GitHub Actions workflow at:

- `.github/workflows/build-windows-installer.yml`

It runs on `windows-latest` and executes `npm run dist:win` to generate a Windows installer.

### Configure signing secrets

Add these GitHub repository secrets:

- `WINDOWS_CERT_BASE64`: Base64-encoded `.pfx` certificate
- `WINDOWS_CERT_PASSWORD`: Password for the `.pfx`

Electron Builder uses these via:

- `CSC_LINK` (certificate data)
- `CSC_KEY_PASSWORD` (certificate password)

If no cert is configured, builds still work but installers will be unsigned and may show SmartScreen warnings.

## Branding assets

Packaging can use optional custom icons at:

- `build/icons/icon.ico` (Windows)
- `build/icons/icon.icns` (macOS)
- `build/icons/icon.png` (Linux)

This repo does **not** commit binary icon files (to keep PR tooling compatible in restricted environments).
If these files are absent, Electron Builder falls back to default icons.

## Steam readiness checklist

For Steam release, the desktop packaging baseline is now in place. Remaining release work:

1. Create Steamworks app and upload builds via SteamPipe.
2. Replace placeholders with final brand assets (capsules, icon sets, installer branding).
3. Validate signed installer install/uninstall on clean Windows machines.
4. Add crash reporting/telemetry if desired.
5. Prepare store assets (screenshots, trailer, copy, age ratings if needed).

## Browser run (no build)

You can still run without Electron:

1. Open `index.html` directly in a browser, or run a static server:
   - `python3 -m http.server 8080`
2. Visit `http://localhost:8080`
3. Configure player names and start.
