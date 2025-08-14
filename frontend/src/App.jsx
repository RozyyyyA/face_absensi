import React from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import FaceRegisterPage from "./pages/FaceRegisterPage"
import AbsensiPage from "./pages/AbsensiPage"
import HistoryPage from "./pages/HistoryPage"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Sidebar from "./components/Sidebar"

function RequireAuth({ children }) {
  const token = localStorage.getItem("access_token")
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  const location = useLocation()
  const token = localStorage.getItem("access_token")
  const hideSidebarOn = ["/login", "/register"] // halaman yang tidak ingin menampilkan sidebar

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar hanya muncul jika login dan bukan login/register */}
        {token && !hideSidebarOn.includes(location.pathname) && <Sidebar />}

        {/* Konten halaman */}
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/face-register"
              element={
                <RequireAuth>
                  <FaceRegisterPage />
                </RequireAuth>
              }
            />
            <Route
              path="/absen"
              element={
                <RequireAuth>
                  <AbsensiPage />
                </RequireAuth>
              }
            />
            <Route
              path="/history"
              element={
                <RequireAuth>
                  <HistoryPage />
                </RequireAuth>
              }
            />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  )
}
