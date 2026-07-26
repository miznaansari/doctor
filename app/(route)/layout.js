"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PatientList from "@/components/PatientList";

export default function WorkspaceLayout({ children }) {
  const pathname = usePathname();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract active patientId if on /patient/[id]
  const isPatientRoute = pathname.startsWith("/patient/");
  const isAddRoute = pathname === "/add";
  const isDetailViewOnMobile = isPatientRoute || isAddRoute;

  const activePatientId = isPatientRoute ? pathname.split("/patient/")[1] : null;

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/patient");
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (res.ok) {
        setPatients(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [pathname]);

  return (
    <div className="flex h-screen w-screen overflow-hidden overflow-x-hidden bg-background font-sans">
      {/* 📱 / 💻 PERSISTENT PATIENT LIST SIDEBAR
          - On Mobile (< md): Visible ONLY on home route /
          - On Desktop (>= md): Always visible on left sidebar!
      */}
      <div
        className={`w-full md:w-80 lg:w-96 shrink-0 h-full overflow-x-hidden ${
          isDetailViewOnMobile ? "hidden md:block" : "block"
        }`}
      >
        {loading && patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
            <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm">Loading workspace...</p>
          </div>
        ) : (
          <PatientList patients={patients} activePatientId={activePatientId} />
        )}
      </div>

      {/* 📱 / 💻 DYNAMIC RIGHT CONTENT VIEW
          - On Mobile (< md): Visible ONLY on detail routes (/patient/[id], /add)
          - On Desktop (>= md): Always visible on right side!
      */}
      <main
        className={`flex-1 flex flex-col h-full min-w-0 overflow-hidden overflow-x-hidden border-l border-border/40 ${
          !isDetailViewOnMobile ? "hidden md:flex" : "flex"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
