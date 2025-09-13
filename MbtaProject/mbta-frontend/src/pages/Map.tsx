import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useTransitStore } from "../store/useTransitStore";
import { VehicleDot } from "../components/VehicleDot";
import { HeadwayBadge } from "../components/HeadwayBadge";
import { DelayBanner } from "../components/DelayBanner";
import { RouteLegend } from "../components/RouteLegend";
import type { NormalizedAlert } from "../services/wsClient";

const INITIAL_CENTER: [number, number] = [42.352, -71.055];

export function MapPage() {
  const { vehicles, alerts, headways, connect, disconnect, highlightedAlertId, setHighlightedAlert } = useTransitStore() as any;
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const activeAlert: NormalizedAlert | undefined = useMemo(
    () => alerts.find((a: NormalizedAlert) => a.id === highlightedAlertId),
    [alerts, highlightedAlertId]
  );

  const impactedByActive = useMemo(() => {
    if (!activeAlert) return () => false;
    const trips = new Set(activeAlert.tripIds || []);
    const routes = new Set(activeAlert.routeIds || []);
    return (tripId?: string | null, routeId?: string | null) =>
      (tripId && trips.has(tripId)) || (routeId && routes.has(routeId));
  }, [activeAlert]);

  return (
    <div className="h-full relative">
      <DelayBanner alerts={alerts} />
      <div className="absolute top-2 left-2 z-[1000]">
        <HeadwayBadge headways={headways} />
      </div>
      <RouteLegend />
      <MapContainer
        // @ts-expect-error: center prop is missing in type definition but required by Leaflet
        center={INITIAL_CENTER}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full"
      >
        <TileLayer
          // @ts-expect-error: attribution prop is missing in type definition but required by Leaflet
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vehicles.map((v: any) => {
          const isImpacted = activeAlert ? impactedByActive(v.tripId, v.routeId) : false;
          return (
            <VehicleDot key={v.id} v={v} highlighted={Boolean(activeAlert && isImpacted)} dimmed={Boolean(activeAlert && !isImpacted)} />
          );
        })}
      </MapContainer>
      {activeAlert ? (
        <div className="absolute top-2 right-2 z-[1000]">
          <button
            className="px-2 py-1 text-xs rounded bg-zinc-800 text-white"
            onClick={() => setHighlightedAlert(null)}
          >
            Clear filter
          </button>
        </div>
      ) : null}
    </div>
  );
}
