export type NormalizedVehicle = {
  id: string;
  label: string | null;
  latitude: number | null;
  longitude: number | null;
  bearing: number | null;
  speed: number | null;
  updatedAt: string | null;
  directionId: 0 | 1 | null;
  currentStatus: string | null;
  tripId: string | null;
  occupancyStatus: string | null;
  stopSequence: number | null;
  routeId: string | null;
  statusText: string;
  delaySec: number | null;
};

export type NormalizedAlert = {
  id: string;
  header: string | null;
  severity: number | null;
  effect: string | null;
  updatedAt: string | null;
  activePeriod: { start: string | null; end: string | null }[];
  routeIds: string[];
  tripIds: string[];
  stopIds: string[];
};

export type HeadwaySummary = {
  directionId: 0 | 1 | null;
  minGapMinutes: number | null;
  computedAt: string;
};

export type VehiclesMessage = {
  type: "vehicles";
  vehicles: NormalizedVehicle[];
  headways: HeadwaySummary[];
  alerts: NormalizedAlert[];
  ts: string;
};
