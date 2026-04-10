"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AddPatientForm from "@/components/AddPatientForm";

export default function AddPatientPage() {
  const router = useRouter();

  const refreshPatients = () => {
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">

      {/* 🔥 HEADER (Sticky) */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-3">

          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-base sm:text-lg font-semibold">
            Add Patient <span className="ml-2 text-xs text-muted-foreground font-normal">(Mobile number required)</span>
          </h1>
        </div>
      </div>

      {/* 🔥 CONTENT */}
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">

        <div className="bg-card border rounded-2xl shadow-sm p-4 sm:p-6">
          <AddPatientForm refreshPatients={refreshPatients} />
        </div>

      </div>
    </div>
  );
}