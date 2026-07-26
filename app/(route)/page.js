"use client";

import { Stethoscope, UserCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center h-full p-8 text-center bg-muted/10">
      <div className="max-w-md flex flex-col items-center space-y-4 font-sans">
        <div className="w-20 h-20 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-inner border border-teal-500/20">
          <Stethoscope className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Doctor Workspace</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Select a patient from the list on the left to view medical history, visit records, and add new prescriptions.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-full border border-border/60 shadow-sm">
          <UserCheck className="w-4 h-4 text-emerald-500" />
          <span>WhatsApp-style Navigation Enabled</span>
        </div>
      </div>
    </div>
  );
}
