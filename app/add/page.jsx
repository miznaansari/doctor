"use client";

import { useRouter } from "next/navigation";
import AddPatientForm from "@/components/AddPatientForm";

export default function AddPatientPage() {
  const router = useRouter();

  const refreshPatients = () => {
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow">
        
        {/* Header */}
        <div className="p-4 border-b font-semibold flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            ← Back
          </button>

          Add Patient
        </div>

        <AddPatientForm refreshPatients={refreshPatients} />
      </div>
    </div>
  );
}
