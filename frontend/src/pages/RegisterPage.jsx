import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../utils/api'

export default function RegisterPage() {
  const [nama, setNama] = useState('')
  const [npm, setNpm] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const res = await registerUser({ nama, npm, password })
      setSuccess(res.data.message || 'Registrasi berhasil')
      setTimeout(() => navigate('/login'), 1500) // redirect ke login
    } catch (err) {
      setError(err.response?.data?.detail || 'Registrasi gagal')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center">Register</h2>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              value={nama}
              onChange={e => setNama(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Masukkan nama"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">NPM</label>
            <input
              value={npm}
              onChange={e => setNpm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Masukkan NPM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Masukkan password"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-indigo-600 hover:text-indigo-700 focus:outline-none"
          >
            Sudah punya akun? Login
          </button>
        </div>
      </div>
    </div>
  )
}
