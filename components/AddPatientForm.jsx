"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, User, Calendar, Phone, MapPin, UserCheck, Stethoscope } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AddPatientForm({ refreshPatients }) {
  const router = useRouter();

  const initialForm = {
    patientName: "",
    age: "",
    gender: "Male",
    fatherName: "",
    mobileNumber: "",
    address: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.patientName.trim()) newErrors.patientName = "Patient name is required";
    if (!form.age || form.age <= 0) newErrors.age = "Valid age is required";
    if (!form.fatherName.trim()) newErrors.fatherName = "Father/Guardian name is required";
    if (!form.mobileNumber.trim()) newErrors.mobileNumber = "Mobile number is required";
    else if (!/^\d{10,15}$/.test(form.mobileNumber.trim())) newErrors.mobileNumber = "Enter a valid 10-15 digit mobile number";
    if (!form.address.trim()) newErrors.address = "Address is required";
    return newErrors;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    const toastId = toast.loading("Registering new patient...");

    try {
      const res = await fetch("/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.errors) setErrors(data.errors);
        toast.error(data?.error || "Failed to register patient", { id: toastId });
        setLoading(false);
        return;
      }

      toast.success("Patient registered successfully", { id: toastId });

      setForm(initialForm);
      refreshPatients?.();
      if (data?.id) {
        router.push(`/patient/${data.id}`);
      } else {
        router.push("/");
      }

    } catch {
      toast.error("Network error", { id: toastId });
    }

    setLoading(false);
  };

  return (
    <div className="relative font-sans">
      <form onSubmit={submit} className="space-y-6">

        <div className="border-b border-border/60 pb-3">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Patient Personal Details
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fill in the patient's information to register them into your medical database.
          </p>
        </div>

        {/* 👤 PATIENT FULL NAME */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Patient Full Name *
          </Label>
          <div className={`flex items-center rounded-xl border bg-background transition overflow-hidden ${
            errors.patientName
              ? "border-destructive focus-within:ring-2 focus-within:ring-destructive/20"
              : "border-border/80 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20"
          }`}>
            <div className="pl-3.5 pr-2 text-muted-foreground/70 shrink-0 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={form.patientName}
              onChange={(e) => update("patientName", e.target.value)}
              placeholder="e.g. Mizna Ansari"
              disabled={loading}
              className="w-full py-2.5 pr-4 text-base sm:text-sm bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/60 font-sans"
            />
          </div>
          {errors.patientName && (
            <p className="text-destructive text-xs font-medium">{errors.patientName}</p>
          )}
        </div>

        {/* 🎂 AGE + GENDER + FATHER NAME GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* AGE */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Age (Years) *
            </Label>
            <div className={`flex items-center rounded-xl border bg-background transition overflow-hidden ${
              errors.age
                ? "border-destructive focus-within:ring-2 focus-within:ring-destructive/20"
                : "border-border/80 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20"
            }`}>
              <div className="pl-3.5 pr-2 text-muted-foreground/70 shrink-0 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="number"
                value={form.age}
                onChange={(e) => update("age", e.target.value)}
                placeholder="e.g. 24"
                disabled={loading}
                min="0"
                max="120"
                className="w-full py-2.5 pr-4 text-base sm:text-sm bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/60 font-sans"
              />
            </div>
            {errors.age && (
              <p className="text-destructive text-xs font-medium">{errors.age}</p>
            )}
          </div>

          {/* GENDER */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Gender
            </Label>
            <div className="rounded-xl border border-border/80 bg-background overflow-hidden focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20">
              <select
                value={form.gender}
                onChange={(e) => update("gender", e.target.value)}
                disabled={loading}
                className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-transparent border-0 outline-none text-foreground cursor-pointer font-sans"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* FATHER NAME */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Father / Guardian *
            </Label>
            <div className={`flex items-center rounded-xl border bg-background transition overflow-hidden ${
              errors.fatherName
                ? "border-destructive focus-within:ring-2 focus-within:ring-destructive/20"
                : "border-border/80 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20"
            }`}>
              <div className="pl-3.5 pr-2 text-muted-foreground/70 shrink-0 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={form.fatherName}
                onChange={(e) => update("fatherName", e.target.value)}
                placeholder="Father / Husband name"
                disabled={loading}
                className="w-full py-2.5 pr-4 text-base sm:text-sm bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/60 font-sans"
              />
            </div>
            {errors.fatherName && (
              <p className="text-destructive text-xs font-medium">{errors.fatherName}</p>
            )}
          </div>
        </div>

        {/* 📞 MOBILE NUMBER */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Mobile / Phone Number *
          </Label>
          <div className={`flex items-center rounded-xl border bg-background transition overflow-hidden ${
            errors.mobileNumber
              ? "border-destructive focus-within:ring-2 focus-within:ring-destructive/20"
              : "border-border/80 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20"
          }`}>
            <div className="pl-3.5 pr-2 text-muted-foreground/70 shrink-0 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              value={form.mobileNumber}
              onChange={(e) => update("mobileNumber", e.target.value)}
              placeholder="e.g. 9876543210"
              disabled={loading}
              pattern="\d{10,15}"
              maxLength={15}
              className="w-full py-2.5 pr-4 text-base sm:text-sm bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/60 font-sans"
            />
          </div>
          {errors.mobileNumber && (
            <p className="text-destructive text-xs font-medium">{errors.mobileNumber}</p>
          )}
        </div>

        {/* 📍 ADDRESS */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Residential Address *
          </Label>
          <div className={`flex items-start rounded-xl border bg-background transition overflow-hidden ${
            errors.address
              ? "border-destructive focus-within:ring-2 focus-within:ring-destructive/20"
              : "border-border/80 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20"
          }`}>
            <div className="pl-3.5 pt-3 pr-2 text-muted-foreground/70 shrink-0 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Enter full residential address..."
              disabled={loading}
              className="w-full py-2.5 pr-4 text-base sm:text-sm bg-transparent border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground/60 font-sans"
            />
          </div>
          {errors.address && (
            <p className="text-destructive text-xs font-medium">{errors.address}</p>
          )}
        </div>

        {/* 🚀 SUBMIT BUTTON */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white py-3 rounded-xl font-bold shadow-md transition flex items-center justify-center gap-2 text-base font-sans"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving Patient...</span>
            </>
          ) : (
            <span>Register & Add Visit Record →</span>
          )}
        </Button>

      </form>
    </div>
  );
}