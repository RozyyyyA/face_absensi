import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('access_token')
  const nama = localStorage.getItem('nama')

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('nama')
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="font-extrabold text-indigo-600 text-xl">
          FaceAbsensi
        </div>

        {/* User info & Logout */}
        {token && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Hi, {nama}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
