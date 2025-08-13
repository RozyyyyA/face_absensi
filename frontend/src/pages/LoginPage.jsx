import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";

export default function LoginPage() {
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ npm, password }); // pakai fungsi dari api.js
      const data = res.data; // axios langsung kasih data

      // simpan token & user info ke localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("nama", data.nama);

      // redirect ke halaman absensi
      navigate("/absen");
    } catch (err) {
      setError(err.response?.data?.detail || "Login gagal");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              NPM
            </label>
            <input
              value={npm}
              onChange={(e) => setNpm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter your NPM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-sm text-indigo-600 hover:text-indigo-700 focus:outline-none"
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
}
