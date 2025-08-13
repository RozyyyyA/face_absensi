import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar(){
  const navigate = useNavigate()
  const token = localStorage.getItem('access_token')
  const nama = localStorage.getItem('nama')

  function logout(){
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('nama')
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold">FaceAbsensi</Link>
        <div className="flex items-center gap-3">
          {token ? (
            <>
              <span className="text-sm text-gray-600">{nama}</span>
              <Link to="/absen" className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">Absen</Link>
              <Link to="/face-register" className="px-3 py-1 rounded bg-green-600 text-white text-sm">Register Face</Link>
              <Link to="/history" className="px-3 py-1 rounded bg-gray-200 text-sm">History</Link>
              <button onClick={logout} className="px-3 py-1 rounded bg-red-500 text-white text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}