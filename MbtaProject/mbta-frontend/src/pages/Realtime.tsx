import React, { useEffect, useMemo } from "react";
import { useTransitStore } from "../store/useTransitStore";

export function RealtimePage() {
  const { vehicles, headways, lastTs, connect, disconnect } = useTransitStore() as any;

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const sortedVehicles = useMemo(() => {
    return [...(vehicles || [])].sort((a, b) => {
      const aDelay = a.delaySec ?? 0;
      const bDelay = b.delaySec ?? 0;
      return bDelay - aDelay;
    });
  }, [vehicles]);
  const directionLabel = (dir: 0 | 1 | null | undefined): string => {
    if (dir === 0) return "Southbound";
    if (dir === 1) return "Northbound";
    return "—";
  };

  const toMph = (value: any): number | null => {
    if (value == null) return null;
    const n = typeof value === "number" ? value : Number(value);
    if (!isFinite(n)) return null;
    return Math.round(n * 2.237);
  };

  const getSpeedMph = (v: any): number | null => {
    if (v.speedMph != null) {
      const n = typeof v.speedMph === "number" ? v.speedMph : Number(v.speedMph);
      return isFinite(n) ? Math.round(n) : null;
    }
    if (v.speed != null) return toMph(v.speed);
    if (v.speedKph != null) {
      const n = typeof v.speedKph === "number" ? v.speedKph : Number(v.speedKph);
      return isFinite(n) ? Math.round(n * 0.621371) : null;
    }
    return null;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Realtime Train Dashboard</h2>
        <div className="text-xs text-zinc-600">Updated: {lastTs ?? "—"}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {headways?.map((h: any, idx: number) => (
          <div key={idx} className="border rounded p-3 bg-white">
            <div className="text-sm text-zinc-600">{directionLabel(h.directionId)}</div>
            <div className="text-2xl font-semibold">{h.minGapMinutes ?? "—"} min</div>
            <div className="text-[11px] text-zinc-500 mt-1">as of {h.computedAt}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-base font-medium mb-2">Trains</h3>
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-100 text-left">
              <tr>
                <th className="px-3 py-2">Train</th>
                <th className="px-3 py-2">Route</th>
                <th className="px-3 py-2">Direction</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {sortedVehicles.map((v: any) => (
                <tr key={v.id} className="border-t">
                  <td className="px-3 py-2 whitespace-nowrap">{v.label ?? v.id}</td>
                  <td className="px-3 py-2">{v.routeId ?? "—"}</td>
                  <td className="px-3 py-2">{directionLabel(v.directionId)}</td>
                  <td className="px-3 py-2">{v.statusText ?? v.currentStatus ?? "—"}</td>
                  <td className="px-3 py-2">{v.updatedAt ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


