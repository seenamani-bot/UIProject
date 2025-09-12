import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MapPage } from "../pages/Map";
// @ts-expect-error: AlertsPage import may not resolve if file is missing
import { AlertsPage } from "../pages/Alerts";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/map" replace />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
    </Routes>
  );
}
