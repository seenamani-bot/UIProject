import { PropsWithChildren } from 'react'
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material'

export function MainLayout({ children }: PropsWithChildren) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Security Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 2, flexGrow: 1 }}>{children}</Container>
    </Box>
  )
}


