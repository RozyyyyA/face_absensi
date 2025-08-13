import React, { useState } from "react";

export default function LoginPage() {
  const [npm, setNpm] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ npm, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.detail || "Login gagal" });
        return;
      }
      localStorage.setItem("access_token", data.access_token);
      setMsg({ type: "success", text: "Login berhasil" });
      // redirect ke halaman absensi mis. router.push("/absensi")
    } catch (err) {
      setMsg({ type: "error", text: "Network error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <input value={npm} onChange={(e) => setNpm(e.target.value)} placeholder="NPM" className="w-full p-2 border rounded mb-2" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-2 border rounded mb-4" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
        {msg && <p className={`mt-3 ${msg.type === "error" ? "text-red-600" : "text-green-600"}`}>{msg.text}</p>}
      </form>
    </div>
  );
}
