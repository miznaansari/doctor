"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, PlusCircle, Phone, PhoneOff, Stethoscope, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PatientHeader from "@/components/PatientHeader";
import RecordCard from "@/components/RecordCard";
import AddRecordForm from "@/components/AddRecordForm";

/* 🟢 Authentic WhatsApp SVG Icon */
function WhatsAppIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.438 5.168L2 22l4.986-1.309A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.634 0-3.15-.443-4.46-1.215l-.32-.187-2.955.775.789-2.881-.206-.328A7.954 7.954 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
    </svg>
  );
}

export default function PatientDetail({ patient, records = [], loading = false, refreshRecords, showMobileBack = true }) {
  const formRef = useRef(null);
  const scrollRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  if (!patient && loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-3" />
        <p className="text-sm font-semibold text-foreground">Loading patient details...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground font-sans">
        <Stethoscope className="w-12 h-12 mb-3 opacity-30 text-teal-600" />
        <p className="text-lg font-medium text-foreground">Select a patient</p>
        <p className="text-sm text-muted-foreground mt-1">Choose a patient from the list to view their medical records</p>
      </div>
    );
  }

  const mobile = patient.mobileNumber || patient.phone || "";
  const cleanMobile = mobile ? mobile.replace(/\D/g, "") : "";

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden bg-background font-sans">
      
      {/* 📱 STICKY MOBILE TOP NAVIGATION BAR */}
      {showMobileBack && (
        <div className="shrink-0 md:hidden h-14 bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-900 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950 text-white border-b border-white/10 px-3 flex items-center justify-between sticky top-0 z-20 shadow-md">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Link
              href="/"
              className="p-1.5 -ml-1 text-white/90 hover:text-white active:scale-95 transition rounded-full hover:bg-white/10"
              aria-label="Back to patient list"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-sm text-white truncate leading-tight">
                {patient.patientName}
              </h1>
              <p className="text-[10px] text-teal-100/80 dark:text-slate-400 truncate">
                {records.length} {records.length === 1 ? "record" : "records"} {mobile ? `• ${mobile}` : "• No Mobile"}
              </p>
            </div>
          </div>

          {/* Quick Actions (Call / WhatsApp / No Number handling) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {mobile ? (
              <>
                <a
                  href={`tel:${mobile}`}
                  className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition active:scale-95"
                  title="Call Patient"
                >
                  <Phone className="w-4 h-4" />
                </a>
                {cleanMobile && (
                  <a
                    href={`https://wa.me/${cleanMobile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition active:scale-95 shadow-sm"
                    title="WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                  </a>
                )}
              </>
            ) : (
              <span className="text-[10px] bg-white/10 text-white/70 px-2 py-1 rounded-full flex items-center gap-1">
                <PhoneOff className="w-3 h-3 opacity-60" />
                No Mobile
              </span>
            )}
          </div>
        </div>
      )}

      {/* 📜 SCROLLABLE CONTENT AREA (Pure Vertical Y-Axis Scroll, Strictly No X-Scroll) */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6 scrollbar-thin scroll-smooth">
        
        {/* PATIENT INFO HEADER CARD */}
        <PatientHeader
          patient={patient}
          totalRecords={records.length}
          onAddRecordClick={scrollToForm}
          onRefresh={refreshRecords}
        />

        {/* MEDICAL RECORDS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Visit History & Prescriptions
              <span className="text-xs bg-teal-500/15 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full font-semibold border border-teal-500/20">
                {records.length}
              </span>
            </h2>
          </div>

          {loading && records.length === 0 ? (
            /* Sleek Skeleton Loader Cards */
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 w-full rounded-xl bg-muted/60 animate-pulse border border-border/40" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-10 bg-card border border-dashed border-border/80 rounded-2xl p-6 text-muted-foreground shadow-sm">
              <PlusCircle className="w-10 h-10 mx-auto mb-2 text-teal-600/60 dark:text-teal-400/60 animate-bounce" />
              <p className="text-sm font-semibold text-foreground">No records added yet</p>
              <p className="text-xs text-muted-foreground mt-1">Use the form below to record {patient.patientName}'s first visit.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {records.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                  >
                    <RecordCard record={record} defaultOpen={index === 0} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ADD RECORD FORM SECTION */}
        <div ref={formRef} className="pt-4 border-t border-border/60">
          <AddRecordForm
            selectedPatient={patient}
            refreshRecords={refreshRecords}
            onSaveSuccess={scrollToTop}
          />
        </div>
      </div>
    </div>
  );
}
