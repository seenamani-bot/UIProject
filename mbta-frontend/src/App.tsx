import React from "react";
import { Link } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between px-4 py-2 bg-redline text-white">
        <h1 className="font-semibold">MBTA Red Line Dashboard</h1>
        <nav className="space-x-4">
          <Link to="/map" className="hover:underline">Map</Link>
          <Link to="/alerts" className="hover:underline">Alerts</Link>
        </nav>
      </header>
      <main className="flex-1 min-h-0">
        <AppRoutes />
      </main>
    </div>
  );
}
