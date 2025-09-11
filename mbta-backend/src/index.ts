import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import {
  computeHeadways,
  fetchAlerts,
  fetchPredictions,
  fetchRoutes,
  fetchStops,
  fetchVehicles,
  normalizeAlerts,
  normalizeVehicles,
} from "./mbta";
import { VehiclesMessage, NormalizedVehicle, NormalizedAlert, HeadwaySummary } from "./types";

const PORT = Number(process.env.PORT ?? 8080);
const ROUTE_ID = String(process.env.ROUTE_ID ?? "Red");
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS ?? 7000);

const app = express();
app.use(cors());
app.use(express.json());

let lastVehicles: NormalizedVehicle[] = [];
let lastAlerts: NormalizedAlert[] = [];
let lastHeadways: HeadwaySummary[] = [];
let lastUpdatedIso: string | null = null;

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, route: ROUTE_ID, updatedAt: lastUpdatedIso });
});

let routesCache: any | null = null;
let routesCacheAt = 0;
let stopsCacheByRoute: Record<string, { at: number; data: any }> = {};

app.get("/api/routes", async (_req, res) => {
  try {
    const now = Date.now();
    if (!routesCache || now - routesCacheAt > 5 * 60 * 1000) {
      routesCache = await fetchRoutes();
      routesCacheAt = now;
    }
    res.json(routesCache);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "failed to fetch routes" });
  }
});

app.get("/api/stops", async (req, res) => {
  const routeId = String((req.query as any).route ?? ROUTE_ID);
  try {
    const now = Date.now();
    const cache = stopsCacheByRoute[routeId];
    if (!cache || now - cache.at > 5 * 60 * 1000) {
      const data = await fetchStops(routeId);
      stopsCacheByRoute[routeId] = { at: now, data };
    }
    res.json(stopsCacheByRoute[routeId].data);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "failed to fetch stops" });
  }
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ws/vehicles" });

function broadcast(message: VehiclesMessage) {
  const payload = JSON.stringify(message);
  for (const client of wss.clients) {
    try {
      // @ts-ignore ws client has readyState
      if ((client as any).readyState === 1) (client as any).send(payload);
    } catch {}
  }
}

wss.on("connection", (ws) => {
  const init: VehiclesMessage = {
    type: "vehicles",
    vehicles: lastVehicles,
    headways: lastHeadways,
    alerts: lastAlerts,
    ts: new Date().toISOString(),
  };
  ws.send(JSON.stringify(init));
});

async function pollOnce() {
  try {
    const [vehiclesRaw, alertsRaw, predictionsRaw] = await Promise.all([
      fetchVehicles(ROUTE_ID),
      fetchAlerts(ROUTE_ID),
      fetchPredictions(ROUTE_ID).catch(() => null),
    ]);

    const vehicles = normalizeVehicles(vehiclesRaw);
    const alerts = normalizeAlerts(alertsRaw);
    const headways = computeHeadways(vehicles, predictionsRaw ?? undefined);

    lastVehicles = vehicles;
    lastAlerts = alerts;
    lastHeadways = headways;
    lastUpdatedIso = new Date().toISOString();

    const msg: VehiclesMessage = {
      type: "vehicles",
      vehicles,
      headways,
      alerts,
      ts: lastUpdatedIso,
    };
    broadcast(msg);
  } catch (err) {
    console.error("Polling error", err);
  }
}

setInterval(pollOnce, POLL_INTERVAL_MS);
pollOnce().catch(() => {});

server.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
  console.log(`WebSocket at ws://localhost:${PORT}/ws/vehicles`);
});
