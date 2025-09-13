import React from "react";

export function RouteLegend() {
  return (
    <div className="absolute top-3 right-3 bg-white/90 rounded shadow px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#DA291C" }} />
        <span>Red Line train</span>
      </div>
    </div>
  );
}
