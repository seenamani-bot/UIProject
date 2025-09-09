import { useSecurityStore, type SecurityEvent } from '../store/useSecurityStore'

export type RealtimeOptions = {
  wsUrl?: string
  simulate?: boolean
}

let ws: WebSocket | undefined
let simulatorInterval: number | undefined

export function startRealtime({ wsUrl, simulate }: RealtimeOptions = {}) {
  const setConnected = useSecurityStore.getState().setConnected
  const addEvent = useSecurityStore.getState().addEvent

  if (simulate) {
    setConnected(true)
    stopRealtime()
    simulatorInterval = window.setInterval(() => {
      const evt: SecurityEvent = {
        id: Math.random().toString(36).slice(2),
        timestamp: Date.now(),
        type: ['motion', 'intrusion', 'face', 'unknown'][
          Math.floor(Math.random() * 4)
        ] as SecurityEvent['type'],
        cameraId: `cam-${1 + Math.floor(Math.random() * 4)}`,
        details: 'Simulated event',
      }
      addEvent(evt)
    }, 1500)
    return
  }

  if (!wsUrl) return

  stopRealtime()
  ws = new WebSocket(wsUrl)
  ws.onopen = () => setConnected(true)
  ws.onclose = () => setConnected(false)
  ws.onerror = () => setConnected(false)
  ws.onmessage = (msg) => {
    try {
      const evt = JSON.parse(msg.data as string) as SecurityEvent
      addEvent(evt)
    } catch {}
  }
}

export function stopRealtime() {
  if (ws) {
    try {
      ws.close()
    } catch {}
  }
  ws = undefined
  if (simulatorInterval) {
    window.clearInterval(simulatorInterval)
    simulatorInterval = undefined
  }
}


