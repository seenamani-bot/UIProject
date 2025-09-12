import React from "react";
import { CircleMarker, Tooltip } from "react-leaflet";
import type { NormalizedVehicle } from "../services/wsClient";

export function VehicleDot({ v }: { v: NormalizedVehicle }) {
  if (v.latitude == null || v.longitude == null) return null;
  const color = "#DA291C"; // MBTA Red
  const radius = 6;
  const tooltip = (
    <div className="text-xs">
      <div><b>Trip</b>: {v.tripId ?? "-"}</div>
      <div><b>Status</b>: {v.statusText || v.currentStatus || "-"}</div>
      {v.delaySec != null && <div><b>Delay</b>: {Math.round(v.delaySec / 60)} min</div>}
      <div><b>Updated</b>: {v.updatedAt ?? "-"}</div>
    </div>
  );
  return (
    <CircleMarker
      center={[v.latitude, v.longitude]}
      pathOptions={{ color, fillColor: color, fillOpacity: 0.9 }}
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
