"use client";

import { Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/app/ThemeToggle";

export default function PatientSidebar({
  patients,
  selectedPatient,
  selectPatient,
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <Card className="w-full sticky top-0 h-[100dvh] flex flex-col border-0 md:border-r md:rounded-r-2xl shadow-sm overflow-hidden">

      {/* HEADER */}
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 bg-primary text-primary-foreground px-4 py-4">
        <div>
          <CardTitle className="text-lg font-semibold">
            Patients
          </CardTitle>
          <p className="text-xs text-primary-foreground/80">
            Manage records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Link href="/add">
            <Button size="icon" variant="secondary" className="rounded-full">
              <Plus />
            </Button>
          </Link>
        </div>
      </CardHeader>

      {/* LIST (SCROLL AREA) */}
      <CardContent
        className="flex-1 overflow-y-auto px-2 py-3 space-y-2
        scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        {patients?.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-10">
            No patients added yet
          </div>
        )}

        {patients?.map((p) => {
          const isActive = selectedPatient?.id === p.id;

          return (
            <div
              key={p.id}
              onClick={() => selectPatient(p)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border group ${
                isActive
                  ? "bg-primary/10 border-primary shadow-sm"
                  : "bg-card border-transparent hover:bg-muted"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10"
                }`}
              >
                {p.patientName?.charAt(0)?.toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex flex-col overflow-hidden">
                <span
                  className={`font-medium truncate ${
                    isActive ? "text-primary" : "text-foreground"
                  }`}
                >
                  {p.patientName}
                </span>

                {p.age && (
                  <span className="text-xs text-muted-foreground">
                    {p.age} yrs
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>

      {/* FOOTER */}
      <div className="shrink-0 p-3 border-t flex items-center justify-between bg-muted/40 backdrop-blur">
        <span className="text-xs text-muted-foreground">
          Logged in
        </span>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </Card>
  );
}