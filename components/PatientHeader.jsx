"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, User, Calendar, Phone, PhoneOff, Stethoscope, Clock, Pencil, Trash2, AlertTriangle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

/* 🟢 Authentic WhatsApp SVG Icon */
function WhatsAppIcon({ className = "w-3.5 h-3.5" }) {
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

export default function PatientHeader({ patient, totalRecords = 0, onAddRecordClick = null, onRefresh = null }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    patientName: patient?.patientName || "",
    age: patient?.age || "",
    gender: patient?.gender || "Male",
    fatherName: patient?.fatherName || "",
    mobileNumber: patient?.mobileNumber || "",
    address: patient?.address || "",
  });

  if (!patient) return null;
  const mobile = patient.mobileNumber || patient.phone || "";
  const cleanMobile = mobile ? mobile.replace(/\D/g, "") : "";

  const formattedDate = patient.createdAt ? new Date(patient.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }) : null;

  const handleOpenEdit = () => {
    setForm({
      patientName: patient.patientName || "",
      age: patient.age || "",
      gender: patient.gender || "Male",
      fatherName: patient.fatherName || "",
      mobileNumber: patient.mobileNumber || "",
      address: patient.address || "",
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      const res = await fetch(`/api/patient/${patient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
        }),
      });

      if (!res.ok) {
        toast.error("Failed to update patient details");
        setSaving(false);
        return;
      }

      toast.success("Patient details updated");
      setEditOpen(false);
      if (onRefresh) {
        onRefresh();
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePatient = async () => {
    if (deleting) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/patient/${patient.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Failed to delete patient");
        setDeleting(false);
        return;
      }

      toast.success("Patient deleted successfully");
      setDeleteOpen(false);
      if (onRefresh) {
        onRefresh();
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Network error while deleting patient");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs font-sans space-y-3.5">

      {/* 🔹 TOP ROW: Patient Avatar, Identity & Total Visits */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar Initial Circle */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 text-white font-extrabold text-base sm:text-lg flex items-center justify-center shrink-0 shadow-xs select-none">
            {patient.patientName?.charAt(0)?.toUpperCase() || "P"}
          </div>

          {/* Name, Gender, Age & Guardian */}
          <div className="min-w-0">
            <h1 className="font-extrabold text-base sm:text-lg text-foreground tracking-tight truncate">
              {patient.patientName}
            </h1>

            {/* Gender, Age & Guardian on the same line without truncation */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground font-medium mt-0.5">
              {patient.gender && (
                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 shrink-0">
                  {patient.gender}
                </span>
              )}

              {patient.age && (
                <span className="text-muted-foreground font-medium shrink-0 flex items-center gap-1.5">
                  {patient.gender && <span className="text-muted-foreground/40">•</span>}
                  <span><strong className="font-semibold text-foreground">{patient.age}</strong> yrs</span>
                </span>
              )}

              {patient.fatherName && (
                <span className="text-muted-foreground flex items-center gap-1.5">
                  {(patient.gender || patient.age) && <span className="text-muted-foreground/40">•</span>}
                  <span>Guardian: <strong className="font-semibold text-foreground">{patient.fatherName}</strong></span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Total Visits Pill */}
        <span className="flex items-center gap-1.5 font-bold text-teal-700 dark:text-teal-300 text-xs bg-teal-500/10 px-2.5 py-1 rounded-xl border border-teal-500/20 shrink-0">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>{totalRecords} {totalRecords === 1 ? "Visit" : "Visits"}</span>
        </span>
      </div>

      {/* 🔹 MIDDLE ROW: Mobile No & Reg Date (Justify Between) + Address */}
      <div className="text-xs text-muted-foreground bg-muted/40 p-2.5 sm:p-3 rounded-xl border border-border/40 space-y-2">
        {/* Phone No (Left) & Reg Date (Right) */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
              <Phone className="w-3.5 h-3.5" />
            </div>
            {mobile ? (
              <a href={`tel:${mobile}`} className="font-semibold text-foreground hover:text-teal-600 hover:underline truncate">
                {mobile}
              </a>
            ) : (
              <span className="italic text-muted-foreground/70">No mobile</span>
            )}
          </div>

          {formattedDate && (
            <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
              <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="font-medium">Reg: {formattedDate}</span>
            </div>
          )}
        </div>

        {/* Address */}
        {patient.address && (
          <div className="flex items-center gap-2 pt-1.5 border-t border-border/30 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <span className="truncate text-muted-foreground font-medium" title={patient.address}>
              {patient.address}
            </span>
          </div>
        )}
      </div>

      {/* 🔹 BOTTOM ROW: CLEAN RESPONSIVE ACTION BUTTONS TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40">
        
        {/* Primary CTA: + Record */}
        {onAddRecordClick && (
          <Button
            onClick={onAddRecordClick}
            size="sm"
            className="h-9 px-3.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition w-full sm:w-auto justify-center"
          >
            <Stethoscope className="w-4 h-4" />
            <span>+ Add Record</span>
          </Button>
        )}

        {/* Action Group: Call, WhatsApp, Delete, Edit */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto justify-end">
          {mobile && (
            <>
              <a
                href={`tel:${mobile}`}
                className="h-9 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/30 transition active:scale-95 flex-1 sm:flex-initial justify-center"
                title="Call Patient"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>

              {cleanMobile && (
                <a
                  href={`https://wa.me/${cleanMobile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-xs flex-1 sm:flex-initial justify-center"
                  title="WhatsApp"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                </a>
              )}
            </>
          )}

          <button
            onClick={() => setDeleteOpen(true)}
            className="h-9 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-1.5 border border-red-500/30 transition active:scale-95 flex-1 sm:flex-initial justify-center"
            title="Delete Patient"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <button
            onClick={handleOpenEdit}
            className="h-9 px-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1.5 border border-border/70 transition active:scale-95 flex-1 sm:flex-initial justify-center"
            title="Edit Patient"
          >
            <Pencil className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* ✏️ EDIT PATIENT MODAL DIALOG */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditOpen(false)} />

          <div className="relative z-50 w-full max-w-lg bg-card border border-border rounded-xl shadow-xl p-5 sm:p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Pencil className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Edit Patient Details
              </h2>
              <button
                onClick={() => setEditOpen(false)}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="editName" className="text-xs font-semibold">Patient Name *</Label>
                <Input
                  id="editName"
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="editAge" className="text-xs font-semibold">Age *</Label>
                  <Input
                    id="editAge"
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editGender" className="text-xs font-semibold">Gender</Label>
                  <select
                    id="editGender"
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editFather" className="text-xs font-semibold">Guardian Name *</Label>
                  <Input
                    id="editFather"
                    value={form.fatherName}
                    onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editMobile" className="text-xs font-semibold">Mobile Number</Label>
                <Input
                  id="editMobile"
                  type="tel"
                  value={form.mobileNumber}
                  onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                  placeholder="Mobile number"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editAddress" className="text-xs font-semibold">Address *</Label>
                <Input
                  id="editAddress"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🗑️ DELETE CONFIRMATION MODAL DIALOG */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteOpen(false)}
          />

          <div className="relative z-50 w-full max-w-md bg-card border border-border rounded-xl shadow-xl p-5 sm:p-6 space-y-4 font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  Delete Patient Record?
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Are you sure you want to delete <span className="font-semibold text-foreground">{patient.patientName}</span>? This patient will be removed from your active workspace.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={deleting}
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={deleting}
                onClick={handleDeletePatient}
                className="font-bold flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {deleting ? "Deleting..." : "Delete Patient"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}