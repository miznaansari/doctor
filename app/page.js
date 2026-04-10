// app/page.jsx  or  pages/index.jsx
"use client";

import { useEffect, useState } from "react";

import PatientSidebar from "@/components/PatientSidebar";
import AddPatientForm from "@/components/AddPatientForm";
import PatientHeader from "@/components/PatientHeader";
import RecordCard from "@/components/RecordCard";
import AddRecordForm from "@/components/AddRecordForm";

export default function Home() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [patientForm, setPatientForm] = useState({});
  const [recordForm, setRecordForm] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patient");
      if (!res.ok) throw new Error("Failed to fetch patients");
      setPatients(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const selectPatient = async (patient) => {
    setSelectedPatient(patient);
    setSidebarOpen(false); // close sidebar on mobile after selection

    try {
      const res = await fetch(`/api/record/${patient.id}`);
      if (!res.ok) throw new Error("Failed to fetch records");
      setRecords(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const addPatient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientForm),
      });
      if (!res.ok) throw new Error("Failed to add patient");
      setPatientForm({});
      fetchPatients();
    } catch (err) {
      console.error(err);
    }
  };

  const addRecord = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      const res = await fetch("/api/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...recordForm,
          patientId: selectedPatient.id,
        }),
      });
      if (!res.ok) throw new Error("Failed to add record");
      setRecordForm({});
      selectPatient(selectedPatient); // refresh records
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row bg-background">
      {/* Mobile header with menu button */}
      <div className="md:hidden bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-foreground">Patient Records</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-muted-foreground hover:text-primary focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar – hidden on mobile unless opened */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 max-w-full bg-background border-r shadow-lg transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-80
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Sidebar"
      >
        <PatientSidebar
          patients={patients}
          selectedPatient={selectedPatient}
          selectPatient={selectPatient}
        />
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!selectedPatient ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-lg">Select a patient from the sidebar</p>
            </div>
          ) : (
            <div className="space-y-6 pb-12">
              <PatientHeader patient={selectedPatient} />
              <div className="space-y-4">
                {records.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No records yet for this patient
                  </div>
                ) : (
                  records.map((record) => (
                    <RecordCard key={record.id} record={record} />
                  ))
                )}
              </div>
              <div className="mt-8">
                <AddRecordForm
                  selectedPatient={selectedPatient}
                  recordForm={recordForm}
                  setRecordForm={setRecordForm}
                  onSubmit={addRecord}
                  refreshRecords={() => selectPatient(selectedPatient)}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}