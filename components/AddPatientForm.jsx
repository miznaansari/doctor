"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AddPatientForm({ refreshPatients }) {
  const router = useRouter();

  const initialForm = {
    patientName: "",
    age: "",
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
    if (!form.patientName.trim()) newErrors.patientName = "Required";
    if (!form.age || form.age < 0) newErrors.age = "Invalid age";
    if (!form.fatherName.trim()) newErrors.fatherName = "Required";
    if (!form.mobileNumber.trim()) newErrors.mobileNumber = "Required";
    else if (!/^\d{10,15}$/.test(form.mobileNumber.trim())) newErrors.mobileNumber = "Invalid mobile number";
    if (!form.address.trim()) newErrors.address = "Required";
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
    const toastId = toast.loading("Creating patient...");

    try {
      const res = await fetch("/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.dismiss(toastId);
        if (data?.errors) setErrors(data.errors);
        else toast.error(data?.error || "Something went wrong");
        setLoading(false);
        return;
      }

      toast.dismiss(toastId);
      toast.success("Patient created");

      setForm(initialForm);
      refreshPatients?.();
      router.push("/");

    } catch {
      toast.dismiss(toastId);
      toast.error("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="relative">

      {/* 🔥 LOADER */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">

        <h2 className="text-lg font-semibold">
          Patient Information
        </h2>

        {/* NAME */}
        <div className="space-y-2">
          <Label>Patient Name</Label>
          <Input
            value={form.patientName}
            onChange={(e) => update("patientName", e.target.value)}
            placeholder="Enter patient name"
            disabled={loading}
          />
          {errors.patientName && (
            <p className="text-destructive text-xs">
              {errors.patientName}
            </p>
          )}
        </div>

        {/* AGE + FATHER + MOBILE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Age</Label>
            <Input
              type="number"
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
              placeholder="Age"
              disabled={loading}
            />
            {errors.age && (
              <p className="text-destructive text-xs">{errors.age}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Father Name</Label>
            <Input
              value={form.fatherName}
              onChange={(e) => update("fatherName", e.target.value)}
              placeholder="Father name"
              disabled={loading}
            />
            {errors.fatherName && (
              <p className="text-destructive text-xs">
                {errors.fatherName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Mobile Number</Label>
            <Input
              value={form.mobileNumber}
              onChange={(e) => update("mobileNumber", e.target.value)}
              placeholder="Mobile number"
              disabled={loading}
              type="tel"
              pattern="\d{10,15}"
              maxLength={15}
            />
            {errors.mobileNumber && (
              <p className="text-destructive text-xs">{errors.mobileNumber}</p>
            )}
          </div>
        </div>

        {/* ADDRESS */}
        <div className="space-y-2">
          <Label>Address</Label>
          <Input
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Address"
            disabled={loading}
          />
          {errors.address && (
            <p className="text-destructive text-xs">
              {errors.address}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Saving..." : "Add Patient"}
        </Button>

      </form>
    </div>
  );
}