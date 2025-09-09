// Simple mock WebSocket server sending random security events
// Run with: node mock-ws-server.js
import { WebSocketServer } from 'ws'

const port = process.env.MOCK_WS_PORT ? Number(process.env.MOCK_WS_PORT) : 8081
const wss = new WebSocketServer({ port })

function randomEvent() {
  const types = ['motion', 'intrusion', 'face', 'unknown']
  return {
    id: Math.random().toString(36).slice(2),
    timestamp: Date.now(),
    type: types[Math.floor(Math.random() * types.length)],
    cameraId: `cam-${1 + Math.floor(Math.random() * 4)}`,
    details: 'Mock WS event',
  }
}

wss.on('connection', (ws) => {
  const interval = setInterval(() => {
    ws.send(JSON.stringify(randomEvent()))
  }, 1500)
  ws.on('close', () => clearInterval(interval))
})

console.log(`[mock-ws] listening on ws://localhost:${port}`)


