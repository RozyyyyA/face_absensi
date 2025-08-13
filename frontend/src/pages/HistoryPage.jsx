import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function HistoryPage(){
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      const userId = localStorage.getItem('user_id')
      if (!userId) {
        console.error("User ID tidak ditemukan di localStorage")
        setLoading(false)
        return
      }
      try {
        const res = await axios.get(`http://localhost:8000/history/${userId}`)
        setHistory(res.data)
      } catch (err) {
        console.error("Gagal ambil history:", err)
      }
      setLoading(false)
    }
    load()
  },[])

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
        <h2 className="text-black text-xl font-semibold mb-3">Riwayat Absen</h2>
        {loading ? (
            <div>Loading...</div>
        ) : (
            <table className="w-full text-sm border-collapse text-black">
            <thead className="bg-gray-200 text-black">
                <tr className="text-left border-b">
                <th>Tanggal</th>
                <th>Waktu</th>
                <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {history.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center">
                    Belum ada riwayat.
                    </td>
                </tr>
                )}
                {history.map((r, idx) => {
                console.log("Riwayat data:", r); // Debug respons backend
                return (
                    <tr key={idx} className="border-b">
                    <td>{r.tanggal || r.date || "-"}</td>
                    <td>{r.waktu || r.time || "-"}</td>
                    <td>{r.status || r.keterangan || "-"}</td>
                    </tr>
                );
                })}
            </tbody>
            </table>
        )}
    </div>

  )
}
