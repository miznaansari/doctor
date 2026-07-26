"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LogOut, Search, ChevronRight, UserCheck, Phone, PhoneOff, Stethoscope, Menu, X, Sun, Moon, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function PatientList({ patients = [], activePatientId = null, onSelectPatient = null }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setMenuOpen(false);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPatients = patients?.filter((p) =>
    p.patientName?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search) ||
    p.mobileNumber?.includes(search)
  );

  return (
    <div className="w-full h-full flex flex-col bg-card border-r border-border/60 shadow-sm overflow-hidden select-none font-sans relative">
      
      {/* 🩺 MEDICAL HEADER */}
      <div className="shrink-0 h-14 bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950 text-white px-4 shadow-md flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* 3-LINE MENU HAMBURGER BUTTON */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition text-white"
            aria-label="Open menu"
            title="Menu & Settings"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Patients
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium shadow-inner">
                {patients.length}
              </span>
            </h1>
            <p className="text-[11px] text-teal-100/80 dark:text-slate-400 font-medium">Doctor Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Link href="/add">
            <Button
              size="icon"
              variant="ghost"
              className="w-9 h-9 rounded-full bg-white/20 text-white hover:bg-white/30 active:scale-95 transition border-0"
              aria-label="Add patient"
              title="Add Patient"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 🔍 SEARCH BAR */}
      <div className="shrink-0 px-3 py-2.5 bg-muted/40 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl text-base sm:text-sm bg-background border border-border focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-foreground outline-none transition placeholder:text-muted-foreground font-sans"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 📱 CLEAN PATIENT LIST */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/30 px-2 py-2 space-y-1 scrollbar-thin">
        {filteredPatients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-6 text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <UserCheck className="w-6 h-6 opacity-40" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {search ? "No matching patients" : "No patients recorded yet"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {search ? "Try another search term" : "Click '+' to add your first patient"}
            </p>
          </div>
        ) : (
          filteredPatients.map((p) => {
            const isActive = activePatientId === p.id;
            const phoneNum = p.mobileNumber || p.phone;

            return (
              <Link
                key={p.id}
                href={`/patient/${p.id}`}
                onClick={() => {
                  if (onSelectPatient) {
                    onSelectPatient(p);
                  }
                }}
                className={`group flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-teal-500/15 border border-teal-500/40 shadow-sm"
                    : "hover:bg-muted/70 active:bg-muted"
                }`}
              >
                {/* Patient Information */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-1">
                    <h3
                      className={`font-semibold text-sm sm:text-base truncate ${
                        isActive ? "text-teal-700 dark:text-teal-400 font-bold" : "text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition"
                      }`}
                    >
                      {p.patientName}
                    </h3>
                    {p.gender && (
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                        {p.gender}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    {p.age && <span className="font-medium">{p.age} yrs</span>}
                    {phoneNum ? (
                      <span className="flex items-center gap-1 truncate text-muted-foreground">
                        <Phone className="w-3 h-3 opacity-70" />
                        {phoneNum}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 truncate text-muted-foreground/60 italic">
                        <PhoneOff className="w-3 h-3 opacity-40" />
                        No mobile
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive
                      ? "text-teal-600 dark:text-teal-400 translate-x-0.5"
                      : "text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5"
                  }`}
                />
              </Link>
            );
          })
        )}
      </div>

      {/* 🟢 SAFE FOOTER */}
      <div className="shrink-0 px-4 py-3 border-t border-border/50 bg-muted/30 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">Doctor Workspace</span>
        <button
          onClick={() => setMenuOpen(true)}
          className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-semibold"
        >
          <Menu className="w-3.5 h-3.5" />
          Menu & Settings
        </button>
      </div>

      {/* ☰ 3-LINE DRAWER MODAL OVERLAY WITH SMOOTH OPEN & CLOSE ANIMATION */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop Fade animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer Slide in/out animation */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative z-50 w-72 max-w-[80vw] bg-card h-full shadow-2xl flex flex-col border-r border-border font-sans"
            >
              {/* Drawer Header */}
              <div className="bg-gradient-to-r from-teal-700 to-cyan-900 dark:from-slate-950 dark:to-teal-950 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <h2 className="font-bold text-base">Doctor Menu</h2>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                
                {/* Theme Toggle Button */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center justify-between w-full p-3 rounded-xl bg-muted/50 hover:bg-muted transition text-left text-sm font-medium"
                >
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? <Moon className="w-4 h-4 text-teal-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span>Appearance</span>
                  </div>
                  <span className="text-xs uppercase font-bold text-muted-foreground">{theme || "Light"}</span>
                </button>

                {/* Add Patient Link */}
                <Link
                  href="/add"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full p-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 transition text-sm font-medium"
                >
                  <Plus className="w-4 h-4 text-teal-600" />
                  <span>Add New Patient</span>
                </Link>
              </div>

              {/* Logout Footer Section */}
              <div className="p-4 border-t border-border bg-muted/30">
                <Button
                  variant="destructive"
                  className="w-full flex items-center justify-center gap-2 rounded-xl font-bold py-2.5 shadow-sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout Account
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
