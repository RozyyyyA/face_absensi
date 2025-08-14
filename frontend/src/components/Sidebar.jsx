import React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { name: "Absen", path: "/absen", color: "indigo" },
    { name: "Register Face", path: "/face-register", color: "green" },
    { name: "History", path: "/history", color: "gray" },
  ]

  return (
    <aside className="w-64 bg-white shadow-md rounded-r-lg flex flex-col justify-between p-6 h-screen">
      {/* Menu */}
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? `bg-${item.color}-100 text-${item.color}-700`
                  : `text-gray-700 hover:bg-${item.color}-50 hover:text-${item.color}-600`
              }`}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
