import { create } from "zustand";
import { makeVehiclesSocket, VehiclesMessage, NormalizedVehicle, NormalizedAlert, HeadwaySummary } from "../services/wsClient";

export type TransitState = {
  vehicles: NormalizedVehicle[];
  alerts: NormalizedAlert[];
  headways: HeadwaySummary[];
  lastTs: string | null;
  connect: () => void;
  disconnect: () => void;
};

export const useTransitStore = create<TransitState>((set, get) => {
  let socket: WebSocket | null = null;
  return {
    vehicles: [],
    alerts: [],
    headways: [],
    lastTs: null,
    connect: () => {
      if (socket) return;
      socket = makeVehiclesSocket((msg: VehiclesMessage) => {
        set({ vehicles: msg.vehicles, alerts: msg.alerts, headways: msg.headways, lastTs: msg.ts });
      });
      (socket as any).onclose = () => {
        socket = null;
        // attempt simple reconnect after delay
        setTimeout(() => get().connect(), 3000);
      };
    },
    disconnect: () => {
      if (socket) {
        socket.close();
        socket = null;
      }
    }
  };
});
