import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FaceRegisterPage from './pages/FaceRegisterPage'
import AbsensiPage from './pages/AbsensiPage'
import HistoryPage from './pages/HistoryPage'
import Navbar from './components/Navbar'

function RequireAuth({ children }) {
  const token = localStorage.getItem('access_token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/face-register" element={<RequireAuth><FaceRegisterPage /></RequireAuth>} />
          <Route path="/absen" element={<RequireAuth><AbsensiPage /></RequireAuth>} />
          <Route path="/history" element={<RequireAuth><HistoryPage /></RequireAuth>} />
        </Routes>
      </div>
    </div>
  )
}