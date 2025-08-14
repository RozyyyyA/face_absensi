import React, { useRef, useEffect, useState } from "react";
import { doAbsensi } from "../utils/api";

export default function AbsensiPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Gagal akses kamera:", err);
      }
    }
    startCamera();
  }, []);

  async function captureAndAbsen() {
    setStatus("Mendeteksi...");

    const fd = new FormData();
    if (file) {
      fd.append("file", file, file.name);
    } else {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.9));
      fd.append("file", blob, "absen.jpg");
    }

    try {
      const token = localStorage.getItem("access_token");
      const { data } = await doAbsensi(fd, token);
      setStatus(`✅ ${data.message} pada ${data.tanggal} ${data.waktu}`);
    } catch (err) {
      if (err.response) {
        setStatus(err.response.data.detail || "❌ Gagal absen");
      } else {
        setStatus("⚠️ Error komunikasi ke server");
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
        Absensi Wajah (Live Camera / Upload Foto)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kamera & Upload */}
        <div className="flex flex-col items-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full rounded-xl border shadow-sm mb-4"
          />
          <canvas ref={canvasRef} className="hidden" />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0 file:text-sm file:font-semibold
                       file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />

          <div className="flex gap-3 w-full">
            <button
              onClick={captureAndAbsen}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium 
                         hover:bg-indigo-700 transition-colors"
            >
              Absen Sekarang
            </button>
            <button
              onClick={() => {
                setStatus("");
                setFile(null);
              }}
              className="flex-1 border py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Reset
            </button>
          </div>

          {status && (
            <div className="mt-4 text-center text-sm text-gray-700 font-medium">
              {status}
            </div>
          )}
        </div>

        {/* Petunjuk */}
        <div className="p-6 bg-gray-50 border rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Petunjuk</h3>
          <ul className="list-disc ml-5 space-y-3 text-gray-700 text-sm">
            <li>Pastikan wajah terlihat jelas di kamera.</li>
            <li>Atau pilih foto wajah untuk diupload.</li>
            <li>Tekan tombol <b>Absen Sekarang</b> untuk snapshot atau upload foto.</li>
            <li>Jika terjadi error, cek koneksi internet atau token login.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
