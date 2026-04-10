"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Logged in");
      router.push("/");
      router.refresh();
    } else {
      toast.error(data.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold mb-2">Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button disabled={loading} className="bg-green-600 text-white w-full p-2 rounded-lg disabled:opacity-50">
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-sm text-center">
          Don't have an account? <a href="/signup" className="text-green-700 underline">Sign up</a>
        </div>
      </form>
    </div>
  );
}
