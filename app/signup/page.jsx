"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Stethoscope, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/app/ThemeToggle";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const toastId = toast.loading("Creating account...");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully", { id: toastId });
        router.push("/login");
      } else {
        toast.error(data.error || "Signup failed", { id: toastId });
      }
    } catch {
      toast.error("Network error. Please try again.", { id: toastId });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative font-sans">
      
      {/* 🌗 TOP RIGHT THEME TOGGLE */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* 💳 MAIN SIGNUP CARD */}
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-lg p-6 sm:p-8 relative overflow-hidden">
        
        {/* Subtle Gradient Backdrop Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-500/10 via-cyan-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

          {/* 🩺 BRAND HEADER */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 shadow-xs">
              <Stethoscope className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Create Doctor Account
            </h1>
            <p className="text-xs text-muted-foreground">
              Register to start managing your clinical database & patients
            </p>
          </div>

          {/* 👤 NAME INPUT */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Doctor Name
            </label>
            <div className="flex items-center rounded-xl border border-border/80 bg-background transition overflow-hidden focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20">
              <div className="pl-3.5 pr-2 text-muted-foreground/70 shrink-0 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Dr. Mizna Ansari"
                disabled={loading}
                className="w-full py-2.5 pr-4 text-sm bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/60 font-sans"
              />
            </div>
          </div>

          {/* ✉️ EMAIL INPUT */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Email Address *
            </label>
            <div className="flex items-center rounded-xl border border-border/80 bg-background transition overflow-hidden focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20">
              <div className="pl-3.5 pr-2 text-muted-foreground/70 shrink-0 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="doctor@clinic.com"
                disabled={loading}
                className="w-full py-2.5 pr-4 text-sm bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/60 font-sans"
              />
            </div>
          </div>

          {/* 🔒 PASSWORD INPUT */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Password *
            </label>
            <div className="flex items-center rounded-xl border border-border/80 bg-background transition overflow-hidden focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20">
              <div className="pl-3.5 pr-2 text-muted-foreground/70 shrink-0 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={loading}
                className="w-full py-2.5 pr-2 text-sm bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/60 font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3 text-muted-foreground/70 hover:text-foreground transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 🚀 SIGNUP BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white py-3 rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 text-base disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register Account →</span>
            )}
          </button>

          {/* 🔗 LOGIN FOOTER */}
          <p className="text-xs text-center text-muted-foreground pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
              Sign in
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
