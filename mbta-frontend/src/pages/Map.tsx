import React, { useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useTransitStore } from "../store/useTransitStore";
import { VehicleDot } from "../components/VehicleDot";
import { HeadwayBadge } from "../components/HeadwayBadge";
import { DelayBanner } from "../components/DelayBanner";
import { RouteLegend } from "../components/RouteLegend";

const INITIAL_CENTER: [number, number] = [42.352, -71.055];

export function MapPage() {
  const { vehicles, alerts, headways, connect, disconnect } = useTransitStore();
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return (
    <div className="h-full relative">
      <DelayBanner alerts={alerts} />
      <div className="absolute top-2 left-2 z-[1000]">
        <HeadwayBadge headways={headways} />
      </div>
      <RouteLegend />
      <MapContainer center={INITIAL_CENTER} zoom={12} scrollWheelZoom className="h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vehicles.map((v) => (
          <VehicleDot key={v.id} v={v} />
        ))}
      </MapContainer>
    </div>
  );
}
