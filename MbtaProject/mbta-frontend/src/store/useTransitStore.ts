import { create } from "zustand";
import { makeVehiclesSocket, VehiclesMessage, NormalizedVehicle, NormalizedAlert, HeadwaySummary } from "../services/wsClient";

export type TransitState = {
  vehicles: NormalizedVehicle[];
  alerts: NormalizedAlert[];
  headways: HeadwaySummary[];
  lastTs: string | null;
  highlightedAlertId: string | null;
  connect: () => void;
  disconnect: () => void;
  setHighlightedAlert: (id: string | null) => void;
};

export const useTransitStore = create<TransitState>((set, get) => {
  let socket: WebSocket | null = null;
  let connectionRefs = 0;
  return {
    vehicles: [],
    alerts: [],
    headways: [],
    lastTs: null,
    highlightedAlertId: null,
    connect: () => {
      connectionRefs++;
      if (socket) return;
      socket = makeVehiclesSocket((msg: VehiclesMessage) => {
        set({ vehicles: msg.vehicles, alerts: msg.alerts, headways: msg.headways, lastTs: msg.ts });
      });
      (socket as any).onclose = () => {
        socket = null;
        // attempt simple reconnect after delay only if someone still wants a connection
        setTimeout(() => {
          if (connectionRefs > 0 && !socket) {
            get().connect();
          }
        }, 3000);
      };
    },
    disconnect: () => {
      connectionRefs = Math.max(0, connectionRefs - 1);
      if (connectionRefs === 0 && socket) {
        socket.close();
        socket = null;
      }
    },
    setHighlightedAlert: (id: string | null) => set({ highlightedAlertId: id })
  };
});
