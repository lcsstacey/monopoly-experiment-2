# Branding assets (bring your own files)

This repository intentionally does **not** commit binary icon files so PR creation works in environments that block binary diffs.

Add your production icons locally (or in CI) at:

- `build/icons/icon.ico` (Windows)
- `build/icons/icon.icns` (macOS)
- `build/icons/icon.png` (Linux)

The Electron builder config auto-detects these files and uses them only when present.
If they are missing, packaging falls back to default Electron icons.
