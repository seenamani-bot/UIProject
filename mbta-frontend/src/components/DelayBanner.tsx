import React from "react";
import type { NormalizedAlert } from "../services/wsClient";

export function DelayBanner({ alerts }: { alerts: NormalizedAlert[] }) {
  if (!alerts.length) return null;
  const active = alerts.slice(0, 3);
  return (
    <div className="bg-yellow-200 text-yellow-900 px-3 py-2 text-sm">
      <b>Service Alerts:</b> {active.map((a) => a.header || a.effect || a.id).join(" | ")}
    </div>
  );
}
