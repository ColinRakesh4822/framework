# vertex Loadscreen (Vite + Tailwind)

This resource uses a Vite + React + Tailwind UI that builds to `ui/html` for FiveM NUI loadscreen usage.

## Requirements
- Node.js 18+ (recommended)
- pnpm / npm / yarn (any is fine)

## Install
```bash
cd ui
npm install
```

## Development (browser preview)
```bash
npm run dev
```

Note: FiveM loadscreens do not use the Vite dev server. For in-game testing, use a production build.

## Build (FiveM)
```bash
npm run build
```

Output goes to:
- `ui/html/index.html`
- `ui/html/assets/*`

Those files are referenced by `fxmanifest.lua`.
