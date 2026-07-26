"use client";

import PatientList from "@/components/PatientList";

export default function PatientSidebar({ patients = [], selectedPatient = null, selectPatient = null }) {
  return (
    <aside className="w-full h-full border-r bg-background">
      <PatientList
        patients={patients}
        activePatientId={selectedPatient?.id}
        onSelectPatient={selectPatient}
      />
    </aside>
  );
}