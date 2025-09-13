import React from "react";
import { MapPage } from "./Map";
import { RealtimePage } from "./Realtime";

export function DashboardPage() {
  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2">
      <div className="h-[50vh] lg:h-full min-h-0">
        <MapPage />
      </div>
      <div className="h-[50vh] lg:h-full min-h-0 overflow-auto bg-zinc-50">
        <RealtimePage />
      </div>
    </div>
  );
}


