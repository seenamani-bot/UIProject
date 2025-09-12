import axios from "axios";
import { HeadwaySummary, NormalizedAlert, NormalizedVehicle } from "./types";

const MBTA_BASE = "https://api-v3.mbta.com";

const api = axios.create({
  baseURL: MBTA_BASE,
  timeout: 10000,
});

function authHeaders(): Record<string, string> {
  const key = process.env.MBTA_API_KEY;
  return key ? { "x-api-key": String(key) } : {};
}

export async function fetchVehicles(routeId: string): Promise<any> {
  const resp = await api.get("/vehicles", {
    params: { "filter[route]": routeId },
    headers: authHeaders(),
  });
  return resp.data;
}

export async function fetchAlerts(routeId: string): Promise<any> {
  const resp = await api.get("/alerts", {
    params: { "filter[route]": routeId },
    headers: authHeaders(),
  });
  return resp.data;
}

export async function fetchRoutes(): Promise<any> {
  const resp = await api.get("/routes", {
    params: { "filter[type]": "1" },
    headers: authHeaders(),
  });
  return resp.data;
}

export async function fetchStops(routeId: string): Promise<any> {
  const resp = await api.get("/stops", {
    params: { "filter[route]": routeId },
    headers: authHeaders(),
  });
  return resp.data;
}

export async function fetchPredictions(routeId: string): Promise<any> {
  const resp = await api.get("/predictions", {
    params: { "filter[route]": routeId },
    headers: authHeaders(),
  });
  return resp.data;
}

export function normalizeVehicles(data: any): NormalizedVehicle[] {
  if (!data || !Array.isArray(data.data)) return [];
  return data.data.map((d: any) => {
    const a = d.attributes || {};
    const rel = d.relationships || {};
    const tripId = rel.trip?.data?.id ?? null;
    const routeId = rel.route?.data?.id ?? a.route_id ?? null;
    return {
      id: String(d.id),
      label: a.label ?? null,
      latitude: a.latitude ?? null,
      longitude: a.longitude ?? null,
      bearing: a.bearing ?? null,
      speed: a.speed ?? null,
      updatedAt: a.updated_at ?? null,
      directionId: (a.direction_id ?? null) as 0 | 1 | null,
      currentStatus: a.current_status ?? null,
      tripId,
      occupancyStatus: a.occupancy_status ?? null,
      stopSequence: a.current_stop_sequence ?? null,
      routeId,
      statusText: a.current_status ?? "",
      delaySec: null,
    };
  });
}

function isNowWithinActivePeriod(periods: any[]): boolean {
  if (!Array.isArray(periods)) return false;
  const now = Date.now();
  for (const p of periods) {
    const startMs = p?.start ? Date.parse(p.start) : Number.NEGATIVE_INFINITY;
    const endMs = p?.end ? Date.parse(p.end) : Number.POSITIVE_INFINITY;
    if (Number.isFinite(startMs) && now < startMs) continue;
    if (Number.isFinite(endMs) && now > endMs) continue;
    return true;
  }
  return false;
}

export function normalizeAlerts(data: any): NormalizedAlert[] {
  if (!data || !Array.isArray(data.data)) return [];
  const activeOnly = (data.data as any[]).filter((d) =>
    isNowWithinActivePeriod((d?.attributes?.active_period as any[]) || [])
  );
  return activeOnly.map((d: any) => {
    const a = d.attributes || {};
    const r = d.relationships || {};
    const pickIds = (rel: any): string[] => {
      const arr = rel?.data;
      if (Array.isArray(arr)) return arr.map((x: any) => String(x?.id)).filter(Boolean);
      return [];
    };
    return {
      id: String(d.id),
      header: a.header ?? a.short_header ?? null,
      severity: a.severity ?? null,
      effect: a.effect ?? null,
      updatedAt: a.updated_at ?? null,
      activePeriod: Array.isArray(a.active_period)
        ? (a.active_period as any[]).map((p) => ({
            start: p?.start ?? null,
            end: p?.end ?? null,
          }))
        : [],
      routeIds: pickIds(r.routes),
      tripIds: pickIds(r.trips),
      stopIds: pickIds(r.stops),
    };
  });
}

function toEpochSeconds(iso: string | null): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? Math.floor(t / 1000) : null;
}

export function computeHeadways(
  vehicles: NormalizedVehicle[],
  predictions?: any
): HeadwaySummary[] {
  const nowIso = new Date().toISOString();

  let byDir: Record<0 | 1, number[] | undefined> = { 0: undefined, 1: undefined };
  if (predictions && Array.isArray(predictions.data)) {
    const timesByDir: Record<0 | 1, number[]> = { 0: [], 1: [] };
    for (const p of predictions.data) {
      const a = p.attributes || {};
      const dir = (a.direction_id ?? null) as 0 | 1 | null;
      if (dir === 0 || dir === 1) {
        const when = toEpochSeconds(a.departure_time ?? a.arrival_time ?? null);
        if (when) timesByDir[dir].push(when);
      }
    }
    for (const dir of [0, 1] as const) {
      const times = timesByDir[dir].sort((a, b) => a - b);
      byDir[dir] = times;
    }
  }

  const summaries: HeadwaySummary[] = [];
  for (const dir of [0, 1] as const) {
    let minGapMin: number | null = null;
    const times = byDir[dir];
    if (times && times.length >= 2) {
      let minGap = Number.POSITIVE_INFINITY;
      for (let i = 1; i < times.length; i++) {
        const gap = (times[i] - times[i - 1]) / 60;
        if (gap < minGap) minGap = gap;
      }
      minGapMin = Number.isFinite(minGap) ? Math.max(0, Math.round(minGap)) : null;
    } else {
      const dirVehicles = vehicles.filter((v) => v.directionId === dir);
      const updatedTimes = dirVehicles
        .map((v) => toEpochSeconds(v.updatedAt))
        .filter((v): v is number => v !== null)
        .sort((a, b) => a - b);
      if (updatedTimes.length >= 2) {
        let minGap = Number.POSITIVE_INFINITY;
        for (let i = 1; i < updatedTimes.length; i++) {
          const gap = (updatedTimes[i] - updatedTimes[i - 1]) / 60;
          if (gap < minGap) minGap = gap;
        }
        minGapMin = Number.isFinite(minGap) ? Math.max(0, Math.round(minGap)) : null;
      } else {
        minGapMin = null;
      }
    }
    summaries.push({ directionId: dir, minGapMinutes: minGapMin, computedAt: nowIso });
  }
  return summaries;
}
