"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import AddPatientForm from "@/components/AddPatientForm";
import { ThemeToggle } from "@/app/ThemeToggle";

export default function AddPatientPage() {
  const router = useRouter();

  const refreshPatients = () => {
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background font-sans">
      {/* 🩺 STICKY MEDICAL HEADER */}
      <div className="sticky top-0 z-20 h-14 bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950 text-white shadow-md border-b border-white/10 flex items-center">
        <div className="w-full flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="p-1.5 -ml-1 text-white/90 hover:text-white active:scale-95 transition rounded-full hover:bg-white/10 flex items-center gap-1 text-sm font-medium"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
                <UserPlus className="w-4 h-4" />
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Add New Patient
              </h1>
            </div>
          </div>

          <div className="text-white hover:bg-white/10 rounded-full p-0.5 transition">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* 📝 FORM CONTAINER */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-10">
        <div className="bg-card border border-border/80 rounded-2xl shadow-sm p-5 sm:p-8 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-500/10 via-cyan-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
          
          <AddPatientForm refreshPatients={refreshPatients} />
        </div>
      </div>
    </div>
  );
}
