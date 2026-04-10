"use client";

import { MapPin, User, Calendar } from "lucide-react";

export default function PatientHeader({ patient }) {
  console.log('patient',patient)
  return (
    <div className="w-full bg-card border rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

        {/* LEFT: Name */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
            {patient?.patientName?.charAt(0)?.toUpperCase()}
          </div>

          <h2 className="font-semibold text-base sm:text-lg truncate">
            {patient.patientName}
          </h2>
        </div>

        {/* RIGHT: Info (one line desktop, stacked mobile) */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">

          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {patient.age} yrs
          </span>

          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {patient.fatherName} - {patient?.mobileNumber || "No mobile"}
          </span>

          <span className="flex items-center gap-1 truncate max-w-[200px]">
            <MapPin className="w-4 h-4" />
            {patient.address}
          </span>

        </div>
      </div>
    </div>
  );
}