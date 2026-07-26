"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, ChevronDown, Activity, Pill, Lightbulb, CheckCircle2, FileSearch } from "lucide-react";

/* =========================
   🔹 Date Formatter
========================= */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/* =========================
   🔹 Clinical Section Item
========================= */
function ClinicalItem({ icon: Icon, label, value, colorClass = "text-teal-600 dark:text-teal-400" }) {
  if (!value) return null;

  return (
    <div className="bg-muted/30 border border-border/50 rounded-lg p-2.5 space-y-0.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
        <span>{label}</span>
      </div>
      <p className="text-xs sm:text-sm text-foreground leading-relaxed font-medium pl-5 whitespace-pre-line">
        {value}
      </p>
    </div>
  );
}

/* =========================
   🔹 Main RecordCard Component
========================= */
export default function RecordCard({ record, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  const isCured = record.cure?.toLowerCase().includes("cure") || record.cure?.toLowerCase().includes("yes");

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="w-full"
    >
      <div className="bg-card border border-border rounded-xl shadow-xs hover:border-teal-500/50 transition-all overflow-hidden font-sans">
        
        {/* 🔹 COMPACT HEADER */}
        <div
          onClick={() => setOpen(!open)}
          className="p-3 sm:p-3.5 cursor-pointer select-none bg-muted/20 hover:bg-muted/40 transition space-y-1"
        >
          {/* Top Row: Date, Status, and Toggle Button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                {formatDate(record.date)}
              </span>

              {record.cure && (
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    isCured
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                      : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
                  }`}
                >
                  {record.cure}
                </span>
              )}
            </div>

            {/* Right Toggle Button */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0 font-medium bg-background border border-border px-2 py-0.5 rounded-md">
              <span>{open ? "Hide" : "Details"}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </div>
          </div>

          {/* Compact 1-line Summary when closed */}
          {!open && (record.complain || record.treatment) && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5 truncate">
              {record.complain && (
                <span className="truncate">
                  <strong className="text-foreground font-medium">Complaint:</strong> {record.complain}
                </span>
              )}
              {record.treatment && (
                <span className="truncate">
                  <strong className="text-teal-600 dark:text-teal-400 font-medium">Treatment:</strong> {record.treatment}
                </span>
              )}
            </div>
          )}
        </div>

        {/* 🔹 EXPANDED DETAILS */}
        {open && (
          <div className="p-3 sm:p-4 space-y-2.5 bg-background border-t border-border/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <ClinicalItem icon={Activity} label="Patient Complaint" value={record.complain} colorClass="text-amber-600 dark:text-amber-400" />
              <ClinicalItem icon={FileSearch} label="Investigation / Tests" value={record.investigation} colorClass="text-blue-600 dark:text-blue-400" />
              <ClinicalItem icon={Pill} label="Treatment & Prescription" value={record.treatment} colorClass="text-teal-600 dark:text-teal-400" />
              <ClinicalItem icon={Lightbulb} label="Doctor Advice" value={record.advice} colorClass="text-indigo-600 dark:text-indigo-400" />
              <ClinicalItem icon={Activity} label="Improvement" value={record.improvement} colorClass="text-emerald-600 dark:text-emerald-400" />
              <ClinicalItem icon={CheckCircle2} label="Cure Status" value={record.cure} colorClass="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}