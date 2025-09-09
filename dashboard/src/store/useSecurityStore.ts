import { create } from 'zustand'

export type SecurityEvent = {
  id: string
  timestamp: number
  type: 'motion' | 'intrusion' | 'face' | 'unknown'
  cameraId: string
  details?: string
}

type State = {
  isConnected: boolean
  events: SecurityEvent[]
  liveStreamUrl?: string
}

type Actions = {
  setConnected: (connected: boolean) => void
  addEvent: (evt: SecurityEvent) => void
  setLiveStreamUrl: (url: string) => void
  clearEvents: () => void
}

export const useSecurityStore = create<State & Actions>((set) => ({
  isConnected: false,
  events: [],
  liveStreamUrl: undefined,
  setConnected: (connected) => set({ isConnected: connected }),
  addEvent: (evt) => set((s) => ({ events: [evt, ...s.events].slice(0, 200) })),
  setLiveStreamUrl: (url) => set({ liveStreamUrl: url }),
  clearEvents: () => set({ events: [] }),
}))


