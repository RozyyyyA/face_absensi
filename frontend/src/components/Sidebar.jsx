import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarCheck2,
  UserPlus,
  Clock,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Absen", path: "/absen", icon: <CalendarCheck2 size={20} />, color: "indigo" },
    { name: "Register Face", path: "/face-register", icon: <UserPlus size={20} />, color: "green" },
    { name: "History", path: "/history", icon: <Clock size={20} />, color: "gray" },
  ];

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("nama");
    navigate("/login");
  };

  return (
    <aside
      className={`${
      collapsed ? "w-20" : "w-64"
    } bg-white shadow-xl rounded-r-2xl flex flex-col justify-between h-screen transition-all duration-300`}
  >
    <div className="flex flex-col h-full">
    {/* Header */}
  <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-tr-2xl">
    <div className="flex items-center gap-2">
      {!collapsed ? (
        <h1 className="text-lg font-bold text-white">FaceAbsensi</h1>
      ) : (
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
          F
        </div>
      )}
    </div>
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0"
    >
      {collapsed ? (
        <ChevronRight size={18} className="text-white" />
      ) : (
        <ChevronLeft size={18} className="text-white" />
      )}
    </button>
  </div>

  {/* Menu */}
  <nav className="flex flex-col gap-1 px-3 pt-2">
    {menuItems.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
            ${
              isActive
                ? `bg-${item.color}-100 text-${item.color}-700 shadow-sm`
                : `text-gray-600 hover:bg-gray-50 hover:text-${item.color}-600`
            }`}
        >
          {item.icon}
          {!collapsed && <span>{item.name}</span>}
        </Link>
      );
    })}
  </nav>
</div>


    {/* Footer with Logout */}
    <div className="p-3 border-t mt-3">
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200"
      >
        <LogOut size={20} />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
    </aside>
  );
}
