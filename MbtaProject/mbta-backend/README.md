# MBTA Backend (Express + WebSocket)

Provides REST endpoints and a WebSocket stream for MBTA Red Line vehicles, alerts, and basic headways.

## Endpoints
- GET `/healthz`
- GET `/api/routes`
- GET `/api/stops?route=Red`
- WS `/ws/vehicles` → broadcasts `{ type: "vehicles", vehicles, alerts, headways }`

## Setup
1. Copy env:
```bash
cp .env.example .env
# add MBTA_API_KEY if you have one (optional for public endpoints)
```
2. Install and run:
```bash
npm install
npm run dev
```

Server: http://localhost:8080
WebSocket: ws://localhost:8080/ws/vehicles
