"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
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
    } catch {
      toast.error("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">

      <div className="w-full max-w-md bg-card border rounded-2xl shadow-sm p-6 sm:p-8">

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* HEADER */}
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Login to your account
            </p>
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="Enter your email"
              className="w-full text-base px-3 py-2 rounded-lg border bg-background outline-none
              focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Password
            </label>

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full text-base px-3 py-2 rounded-lg border bg-background outline-none
              focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-lg text-base font-medium transition hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* FOOTER */}
          <p className="text-sm text-center text-muted-foreground">
            Don’t have an account?{" "}
            <a href="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </a>
          </p>

        </form>
      </div>
    </div>
  );
}