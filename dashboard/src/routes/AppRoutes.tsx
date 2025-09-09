import { Route, Routes, Navigate } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { Dashboard } from '../pages/Dashboard'

export function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </MainLayout>
  )
}


