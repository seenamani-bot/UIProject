import { useMemo } from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useSecurityStore } from '../store/useSecurityStore'

export function AnalyticsCharts() {
  const events = useSecurityStore((s) => s.events)
  const data = useMemo(() => {
    const byType: Record<string, number> = {}
    for (const e of events) byType[e.type] = (byType[e.type] ?? 0) + 1
    return Object.entries(byType).map(([type, count]) => ({ type, count }))
  }, [events])

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Events by type
        </Typography>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}


