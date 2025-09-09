import { Paper, Typography, Box } from '@mui/material'
import { useEffect } from 'react'
import { VideoPlayer } from '../components/VideoPlayer'
import { EventFeed } from '../components/EventFeed'
import { AnalyticsCharts } from '../components/AnalyticsCharts'
import { startRealtime, stopRealtime } from '../services/realtime'

export function Dashboard() {
  useEffect(() => {
    // startRealtime({ simulate: true })
    startRealtime({ wsUrl: 'ws://localhost:8081' })
    return () => stopRealtime()
  }, [])
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Live Security Overview
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 2,
        }}
      >
        <Paper sx={{ p: 2, height: 400 }}>
          <VideoPlayer />
        </Paper>
        <Paper sx={{ p: 2, height: 400 }}>
          <EventFeed />
        </Paper>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Paper sx={{ p: 2, height: 300 }}>
          <AnalyticsCharts />
        </Paper>
      </Box>
    </Box>
  )
}


