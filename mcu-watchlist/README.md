# MCU Watchlist — Before Doomsday

## Local Setup

1. Install dependencies:
```
npm run install:all
```

2. Make sure `server/.env` has your Supabase credentials:
```
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_ANON_KEY=eyJ...
PORT=3001
```

3. Run the app:
```
npm run dev
```

4. Open http://localhost:5173

## Deploy

### Backend → Render
- Root directory: `server`
- Start command: `node index.js`
- Add env vars: SUPABASE_URL, SUPABASE_ANON_KEY, PORT

### Frontend → Vercel
- Root directory: `client`
- Build command: `npm run build`
- Output: `dist`
- Add env var: VITE_API_URL = your Render URL
