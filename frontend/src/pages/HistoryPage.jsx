import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle, User } from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const nama = localStorage.getItem("nama") || "User";

  useEffect(() => {
    async function loadHistory() {
      const userId = localStorage.getItem("user_id");
      const storedName = localStorage.getItem("username");
      if (storedName) setUsername(storedName);

      if (!userId) {
        console.error("User ID tidak ditemukan di localStorage");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8000/history/${userId}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Gagal ambil history:", err);
      }

      setLoading(false);
    }

    loadHistory();
  }, []);

  const getStatusIcon = (status) => {
    const s = status.toLowerCase();
    if (s === "hadir") return <CheckCircle className="w-4 h-4 mr-1 text-green-700" />;
    if (s === "terlambat") return <AlertTriangle className="w-4 h-4 mr-1 text-red-700" />;
    return <XCircle className="w-4 h-4 mr-1 text-gray-600" />;
  };

  return (
    <div className="p-4">
      {/* 🔹 Header kanan atas */}
      <div className="flex justify-end items-center gap-3mb-4 -mt-8">
        <span className="mr-3 text-gray-700 font-small">Hi, {nama}</span>
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          <User size={22} className="text-gray-600" />
        </div>
      </div>

      {/* 🔹 Card Riwayat */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg max-w-5xl mx-auto mt-2">
        <h2 className="text-black text-2xl font-bold mb-6 text-center">Riwayat Absensi</h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" /> Tanggal
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" /> Waktu
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      Belum ada riwayat absensi.
                    </td>
                  </tr>
                ) : (
                  history.map((r, idx) => {
                    const status = r.status || r.keterangan || "-";
                    return (
                      <tr
                        key={idx}
                        className="border-b last:border-b-0 hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 text-gray-800 text-sm">{r.tanggal || r.date || "-"}</td>
                        <td className="px-4 py-3 text-gray-800 text-sm">{r.waktu || r.time || "-"}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold ${
                              status.toLowerCase() === "hadir"
                                ? "bg-green-100 text-green-700"
                                : status.toLowerCase() === "terlambat"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {getStatusIcon(status)}
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
