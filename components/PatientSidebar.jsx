import clsx from "clsx";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function PatientSidebar({
  patients,
  selectedPatient,
  selectPatient,
}) {
  return (
    <div className="w-80 bg-gray-50 border-r flex flex-col h-full">

      {/* Header */}
      <div className="px-6 py-5 bg-green-600 text-white flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-wide">
            Patients
          </h2>
          <p className="text-sm text-green-100 mt-1">
            Manage patient records
          </p>
        </div>

        {/* Add Patient Icon */}
        <Link href="/add">
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-green-600 text-xl font-bold cursor-pointer hover:bg-green-100 transition">
            <Plus />
          </button>
        </Link>
      </div>

      {/* Patient List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {patients?.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-10">
            No patients added yet
          </div>
        )}

        {patients?.map((p) => {
          const isActive = selectedPatient?.id === p.id;

          return (
            <div
              key={p.id}
              onClick={() => selectPatient(p)}
              className={clsx(
                "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border",
                isActive
                  ? "bg-green-50 border-green-300 shadow-sm"
                  : "bg-white border-transparent hover:bg-gray-100"
              )}
            >
              <div
                className={clsx(
                  "w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold",
                  isActive
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700"
                )}
              >
                {p.patientName?.charAt(0)?.toUpperCase()}
              </div>

              <div className="flex flex-col">
                <span
                  className={clsx(
                    "font-medium",
                    isActive ? "text-green-700" : "text-gray-800"
                  )}
                >
                  {p.patientName}
                </span>

                {p.age && (
                  <span className="text-xs text-gray-500">
                    {p.age} yrs
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


