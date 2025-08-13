import React, { useRef, useEffect, useState } from 'react'
import { doAbsensi } from '../utils/api'

export default function AbsensiPage(){
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [status, setStatus] = useState('')

  useEffect(()=>{
    async function start(){
      try{
        const s = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) videoRef.current.srcObject = s
      }catch(err){
        console.error(err)
      }
    }
    start()
  },[])

  async function captureAndAbsen(){
    setStatus('Mendeteksi...')
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = 640
    canvas.height = 480
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const blob = await new Promise(res => canvas.toBlob(res,'image/jpeg',0.9))

    const fd = new FormData()
    fd.append('file', blob, 'absen.jpg')

    try {
    const token = localStorage.getItem('access_token')
    const { data } = await doAbsensi(fd, token)
    setStatus(`Sukses: ${data.message} pada ${data.tanggal} ${data.waktu}`)
    } catch (err) {
        if (err.response) {
            setStatus(err.response.data.detail || 'Gagal absen')
        } else {
            setStatus('Error komunikasi ke server')
        }
    }

  }

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">Absensi (Live Camera)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <video ref={videoRef} autoPlay muted className="w-full rounded border" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="mt-2 flex gap-2">
            <button onClick={captureAndAbsen} className="bg-indigo-600 text-white px-4 py-2 rounded">Absen Sekarang</button>
            <button onClick={()=>setStatus('')} className="px-4 py-2 border rounded">Reset</button>
          </div>
          <div className="mt-2 text-sm">{status}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <p className="text-sm">Petunjuk:</p>
          <ul className="list-disc ml-6 text-sm">
            <li>Login terlebih dahulu (token disisipkan otomatis).</li>
            <li>Pastikan kamera menampilkan wajahmu (minimal 1 wajah).</li>
            <li>Tekan tombol Absen untuk mengambil snapshot dan melakukan pengenalan.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}