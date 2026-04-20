# MyPorto Mobile App

Expo React Native app for the MyPorto portfolio platform.

## Setup

```bash
cd myporto-app/mobile
npm install
```

## Running

```bash
# Start Expo dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## Environment

Copy `.env` and update the API URL if needed:

```
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

For Android emulator, use `http://10.0.2.2:5000/api` instead of `localhost`.

## Project Structure

```
mobile/
├── app/
│   ├── _layout.tsx          # Root layout with auth check
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx        # Login screen
│   │   └── register.tsx     # Register screen
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigator
│       ├── index.tsx        # Dashboard
│       ├── profile.tsx      # Edit profile
│       ├── education.tsx    # Education CRUD
│       ├── experience.tsx   # Experience CRUD
│       ├── skills.tsx       # Skills CRUD
│       ├── appearance.tsx   # Theme & appearance
│       └── payment.tsx      # Payment & activation
├── lib/
│   ├── api.ts               # Axios instance with JWT
│   └── store.ts             # Zustand auth store
└── assets/                  # App icons & splash (replace placeholders)
```

## Assets

Replace the placeholder files in `assets/` with real images:
- `icon.png` — 1024×1024 app icon
- `splash.png` — 1284×2778 splash screen
- `adaptive-icon.png` — 1024×1024 Android adaptive icon foreground
- `favicon.png` — 32×32 or 64×64 web favicon
