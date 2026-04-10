"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { CalendarDays, ChevronDown } from "lucide-react";

/* =========================
   🔹 Date Formatter (PRO UX)
========================= */
function formatDate(dateStr) {
  const date = new Date(dateStr);

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 → 12

  const hh = String(hours).padStart(2, "0");

  return `${dd}-${mm}-${yy} ${hh}:${minutes}:${seconds} ${ampm}`;
}

/* =========================
   🔹 Field Component
========================= */
function Field({ label, value }) {
  if (!value) return null;

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground font-medium">
        {label}
      </p>
      <p className="text-sm sm:text-base text-foreground leading-relaxed break-words">
        {value}
      </p>
    </div>
  );
}

/* =========================
   🔹 Main Component
========================= */
export default function RecordCard({ record }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="mt-3 rounded-xl shadow-sm border hover:shadow-md transition-all">

        {/* HEADER */}
        <CardHeader
          onClick={() => setOpen(!open)}
          className="flex flex-row items-center justify-between cursor-pointer py-3"
        >
          {/* LEFT */}
          <div className="flex flex-col min-w-0">
            <CardTitle className="text-sm sm:text-base font-semibold">
              Visit Record
            </CardTitle>

            {/* 🧠 Preview */}
            <p className="text-xs text-muted-foreground truncate max-w-[180px] sm:max-w-[300px]">
              {record.complain || "No complaint"}
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground shrink-0">
            <CalendarDays className="w-4 h-4" />

            {/* 📱 Mobile */}
            <span className="">
              {formatDate(record.date)}
            </span>

          

            {/* ICON */}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        </CardHeader>

        {/* CONTENT */}
        {open && (
          <CardContent className="pt-2 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <Field label="Patient Complaint" value={record.complain} />
              <Field label="Investigation" value={record.investigation} />

              <Field label="Treatment Given" value={record.treatment} />
              <Field label="Doctor Advice" value={record.advice} />

              <Field label="Improvement" value={record.improvement} />
              <Field label="Cure Status" value={record.cure} />

            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}