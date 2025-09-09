import { Suspense } from 'react'
import './App.css'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <Suspense fallback={null}>
      <AppRoutes />
    </Suspense>
  )
}

export default App
