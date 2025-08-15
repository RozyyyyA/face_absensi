import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../utils/api";
import loginIllustration from "../components/animasi/loginpage.jpg";

export default function LoginPage() {
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ npm, password });
      const data = res.data;

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("nama", data.nama);

      navigate("/absen");
    } catch (err) {
      setError(err.response?.data?.detail || "Login gagal");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Left Section */}
        <div className="hidden md:flex w-1/2 bg-indigo-600 text-white items-center justify-center p-10">
          <div className="flex flex-col items-center text-center max-w-sm">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Selamat Datang di FaceAbsensi
            </h1>
            <p className="text-base opacity-90 mb-8">
              Sistem absensi modern berbasis Face Recognition untuk mendukung
              proses kehadiran yang lebih cepat, aman, dan efisien.
            </p>
            <img
              src={loginIllustration}
              alt="Login Illustration"
              className="w-64 h-auto object-contain"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
              Login Account
            </h2>

            <form onSubmit={submit} className="space-y-5">
              {/* NPM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NPM
                </label>
                <input
                  value={npm}
                  onChange={(e) => setNpm(e.target.value)}
                  placeholder="Enter your NPM"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>
              </div>

              {/* Error */}
              {error && <div className="text-red-600 text-sm">{error}</div>}

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg 
                          hover:bg-indigo-700 transition-colors font-medium"
              >
                Login
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Registrasi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
