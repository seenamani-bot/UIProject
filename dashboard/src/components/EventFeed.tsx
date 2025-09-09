import { List, ListItem, ListItemText, Chip, Stack } from '@mui/material'
import { useSecurityStore } from '../store/useSecurityStore'

const typeToColor: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'> = {
  motion: 'info',
  intrusion: 'error',
  face: 'success',
  unknown: 'warning',
}

export function EventFeed() {
  const events = useSecurityStore((s) => s.events)
  return (
    <List dense sx={{ maxHeight: '100%', overflow: 'auto' }}>
      {events.map((e) => (
        <ListItem key={e.id} divider>
          <ListItemText
            primary={new Date(e.timestamp).toLocaleTimeString()}
            secondary={`Camera ${e.cameraId} — ${e.details ?? ''}`}
          />
          <Stack direction="row" spacing={1}>
            <Chip size="small" label={e.type} color={typeToColor[e.type]} />
          </Stack>
        </ListItem>
      ))}
    </List>
  )
}


