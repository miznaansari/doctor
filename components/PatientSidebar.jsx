"use client";

import { useState } from "react";
import { Plus, LogOut, Search } from "lucide-react";
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
  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  // 🔍 Filter patients
  const filteredPatients = patients?.filter((p) =>
    p.patientName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="w-full sticky top-0 h-[100dvh] flex flex-col border-0 md:border-r shadow-lg bg-background/95 backdrop-blur-xl overflow-hidden pt-0 rounded-none">
      
      {/* HEADER */}
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-5 shadow-md rounded-none">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight drop-shadow-sm">
            Patients
          </CardTitle>
          <p className="text-xs text-primary-foreground/90 mt-1 font-medium">
            Manage records
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/add" passHref legacyBehavior>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring/70 transition"
              aria-label="Add patient"
            >
              <Plus />
            </Button>
          </Link>
        </div>
      </CardHeader>

      {/* 🔍 SEARCH BAR */}
      <div className="px-3 py-2 border-b bg-background/80 backdrop-blur-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-muted/60 border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* LIST */}
      <CardContent className="flex-1 overflow-y-auto px-2 py-3 space-y-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent bg-background/80">
        
        {/* EMPTY STATE */}
        {filteredPatients?.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-10 italic opacity-70">
            {search ? "No matching patients found" : "No patients added yet"}
          </div>
        )}

        {/* PATIENT LIST */}
        {filteredPatients?.map((p) => {
          const isActive = selectedPatient?.id === p.id;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => selectPatient(p)}
              className={`group flex items-center gap-3 w-full p-3 rounded-xl cursor-pointer border transition-all duration-150 focus-visible:ring-2 focus-visible:ring-ring/70 outline-none ${
                isActive
                  ? "bg-primary/10 border-primary shadow-md"
                  : "bg-card border-transparent hover:bg-muted/70 hover:shadow-sm"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-base font-bold transition-all border-2 ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary/80 scale-105 shadow"
                    : "bg-muted text-muted-foreground border-transparent group-hover:border-primary/40 group-hover:scale-105"
                }`}
              >
                {p.patientName?.charAt(0)?.toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex flex-col overflow-hidden text-left">
                <span
                  className={`font-semibold truncate ${
                    isActive
                      ? "text-primary"
                      : "text-foreground group-hover:text-primary"
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
            </button>
          );
        })}
      </CardContent>

      {/* FOOTER */}
      <div className="shrink-0 p-4 border-t flex items-center justify-between bg-muted/60 backdrop-blur-lg">
        <span className="text-xs text-muted-foreground font-medium tracking-wide">
          Logged in
        </span>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full shadow-sm hover:scale-105 focus-visible:ring-2 focus-visible:ring-destructive/60 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </Card>
  );
}