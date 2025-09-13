import React from "react";
import type { HeadwaySummary } from "../services/wsClient";

export function HeadwayBadge({ headways }: { headways: HeadwaySummary[] }) {
  const min = headways
    .map((h) => h.minGapMinutes)
    .filter((v): v is number => v != null)
    .reduce<number | null>((acc, v) => (acc == null ? v : Math.min(acc, v)), null);
  return (
    <span className="inline-flex items-center rounded bg-zinc-100 text-zinc-800 px-2 py-1 text-xs font-medium">
      Headway: {min != null ? `${min} min` : "n/a"}
    </span>
  );
}
