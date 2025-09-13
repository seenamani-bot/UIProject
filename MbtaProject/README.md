# MBTA Red Line Dashboard (Realtime)

This project provides a realtime dashboard for MBTA Red Line using the MBTA v3 API.

## Apps
- `mbta-backend`: Express + WebSocket proxy. Polls MBTA every 5–10s and broadcasts vehicles, alerts, and headways.
- `mbta-frontend`: React + Vite + Tailwind + Leaflet dashboard with routes `/map` and `/alerts`.

## Prerequisites
- Node.js 18+

## Running Backend
```bash
cd UIProject/MbtaProject/mbta-backend
cp .env.example .env
# Optionally add MBTA_API_KEY to .env
npm install
npm run dev
# http://localhost:8080, WS: ws://localhost:8080/ws/vehicles
```
.env
## Running Frontend
```bash
cd UIProject/MbtaProject/mbta-frontend
npm install
npm run dev
# Open the printed Vite URL (usually http://localhost:5173)
```

The frontend proxies `/api` and `/ws` to `http://localhost:8080` during development.

## Storybook
```bash
cd UIProject/MbtaProject/mbta-frontend
npm run storybook
```

## Notes
- Default route is `Red`. Override via backend `.env` (`ROUTE_ID=Red`).
- Poll interval default is `7000ms`. Configure `POLL_INTERVAL_MS` in backend `.env`.

# Replace YOUR_KEY
curl -sS 'https://api-v3.mbta.com/alerts?filter[route]=Red' \
  -H 'x-api-key: 6a7dea2bac8447ad857c2181b4c30015' | jq '.data | length'

  https://api-v3.mbta.com/alerts?filter[route]=Orange&api_key=6a7dea2bac8447ad857c2181b4c30015
