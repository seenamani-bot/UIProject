import React from "react";
import { CircleMarker, Tooltip } from "react-leaflet";
import type { NormalizedVehicle } from "../services/wsClient";

export function VehicleDot({ v, highlighted, dimmed }: { v: NormalizedVehicle; highlighted?: boolean; dimmed?: boolean }) {
  if (v.latitude == null || v.longitude == null) return null;
  const color = highlighted ? "#111827" : "#DA291C"; // darker when highlighted
  const radius = highlighted ? 8 : 6;
  const opacity = dimmed ? 0.3 : 0.9;
  const tooltip = (
    <div className="text-xs">
      <div><b>Trip</b>: {v.tripId ?? "-"}</div>
      <div><b>Status</b>: {v.statusText || v.currentStatus || "-"}</div>
      <div><b>Updated</b>: {v.updatedAt ?? "-"}</div>
    </div>
  );
  return (
    <CircleMarker
      center={[v.latitude, v.longitude]}
      pathOptions={{ color, fillColor: color, fillOpacity: opacity }}
      // @ts-expect-error: radius is supported by react-leaflet CircleMarker but not in type defs
      radius={radius}
    >
      <Tooltip
        // @ts-expect-error: offset is supported by react-leaflet Tooltip but not in type defs
        offset={[0, -radius]}
        opacity={1}
        permanent={false}
      >
        {tooltip}
      </Tooltip>
    </CircleMarker>
  );
  
}
