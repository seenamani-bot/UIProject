import React, { useEffect } from "react";
import { useTransitStore } from "../store/useTransitStore";

export function AlertsPage() {
  const { alerts, connect, disconnect } = useTransitStore();
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-semibold">Active Alerts</h2>
      {!alerts.length && <div className="text-sm text-zinc-600">No active alerts</div>}
      <ul className="space-y-2">
        {alerts.map((a) => (
          <li key={a.id} className="border rounded p-3 bg-white">
            <div className="font-medium">{a.header || a.effect || a.id}</div>
            <div className="text-xs text-zinc-600">Severity: {a.severity ?? "n/a"}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
