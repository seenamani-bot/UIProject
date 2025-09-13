import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MapPage } from "../pages/Map";
import { AlertsPage } from "../pages/Alerts";
import { RealtimePage } from "../pages/Realtime";
import { DashboardPage } from "../pages/Dashboard";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/map" replace />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/realtime" element={<RealtimePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}
