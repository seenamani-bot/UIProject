import React, { useEffect, useMemo } from "react";
import { useTransitStore } from "../store/useTransitStore";
import type { NormalizedAlert } from "../services/wsClient";
import { useNavigate } from "react-router-dom";

export function AlertsPage() {
  const { alerts, connect, disconnect, vehicles, setHighlightedAlert } = useTransitStore() as any;
  const navigate = useNavigate();
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const impactedCounts = useMemo((): Record<string, number> => {
    const byAlert: Record<string, number> = {};
    for (const a of alerts) {
      const trips = new Set(a.tripIds || []);
      const routes = new Set(a.routeIds || []);
      const stops = new Set(a.stopIds || []);
      let count = 0;
      for (const v of vehicles || []) {
        const tripMatch = v.tripId && trips.has(v.tripId);
        const routeMatch = v.routeId && routes.has(v.routeId);
        // stop match is not directly available; skip for now or if we later add
        if (tripMatch || routeMatch) count++;
      }
      byAlert[a.id] = count;
    }
    return byAlert;
  }, [alerts, vehicles]);

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-semibold">Active Alerts</h2>
      {!alerts.length && <div className="text-sm text-zinc-600">No active alerts</div>}
      <ul className="space-y-2">
        {alerts.map((a: NormalizedAlert) => (
          <li
            key={a.id}
            className="border rounded p-3 bg-white hover:bg-zinc-50 cursor-pointer"
            onClick={() => {
              setHighlightedAlert(a.id);
              navigate("/map");
            }}
          >
            <div className="font-medium">{a.header || a.effect || a.id}</div>
            <div className="text-xs text-zinc-600">Severity: {a.severity ?? "n/a"}</div>
            <div className="text-xs text-zinc-700 mt-1">
              Impacted vehicles: {impactedCounts[a.id] ?? 0}
            </div>
            {(a.routeIds?.length || a.tripIds?.length) ? (
              <div className="text-[11px] text-zinc-500 mt-1">
                {a.routeIds?.length ? (
                  <span>Routes: {a.routeIds.join(", ")} </span>
                ) : null}
                {a.tripIds?.length ? (
                  <span>Trips: {a.tripIds.slice(0, 4).join(", ")}{a.tripIds.length > 4 ? "…" : ""}</span>
                ) : null}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
