"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Calendar } from "lucide-react";

/* =========================
   🔹 Reusable Input
========================= */
function Input({ label, type = "text", icon, value, onChange, error, loading }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value || ""}
          disabled={loading}
          onChange={onChange}
          className={`w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition
            ${icon ? "pl-9" : ""}
            ${
              error
                ? "border-red-500"
                : "border-border focus:ring-2 focus:ring-primary/30"
            }
            disabled:opacity-60`}
        />
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

/* =========================
   🔹 Reusable TextArea
========================= */
function TextArea({ label, value, onChange, error, loading }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>

      <textarea
        rows={3}
        value={value || ""}
        disabled={loading}
        onChange={onChange}
        className={`w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none resize-none transition
          ${
            error
              ? "border-red-500"
              : "border-border focus:ring-2 focus:ring-primary/30"
          }
          disabled:opacity-60`}
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

/* =========================
   🔹 Main Component
========================= */
export default function AddRecordForm({
  selectedPatient,
  refreshRecords,
}) {
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const [form, setForm] = useState({
    date: getCurrentDateTime(),
    complain: "",
    investigation: "",
    advice: "",
    treatment: "",
    improvement: "",
    cure: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔁 Update handler
  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  // 🚀 Submit handler
  const submit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setErrors({});

    const toastId = toast.loading("Saving visit record...");

    try {
      const res = await fetch("/api/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          patientId: selectedPatient.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.dismiss(toastId);

        if (data.errors) {
          setErrors(data.errors);
          toast.error("Please fix the form");
        } else {
          toast.error(data.error || "Something went wrong");
        }

        setLoading(false);
        return;
      }

      // ✅ Success
      toast.dismiss(toastId);
      toast.success("Visit record saved");

      setForm({
        date: getCurrentDateTime(),
        complain: "",
        investigation: "",
        advice: "",
        treatment: "",
        improvement: "",
        cure: "",
      });

      refreshRecords?.();

    } catch {
      toast.dismiss(toastId);
      toast.error("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="relative">

      {/* 🔥 FULL SCREEN LOADER */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving record...
          </div>
        </div>
      )}

      <form
        onSubmit={submit}
        className="bg-card border p-5 mt-4 rounded-2xl shadow-sm space-y-5"
      >
        {/* HEADER */}
        <div className="border-b pb-2">
          <h2 className="font-semibold text-base">
            Add Visit Record
          </h2>
        </div>

        {/* DATE TIME */}
        <Input
          label="Visit Date & Time"
          type="datetime-local"
          icon={<Calendar className="w-4 h-4" />}
          value={form.date}
          onChange={(e) => update("date", e.target.value)}
          error={errors.date}
          loading={loading}
        />

        {/* COMPLAIN */}
        <TextArea
          label="Complain"
          value={form.complain}
          onChange={(e) => update("complain", e.target.value)}
          error={errors.complain}
          loading={loading}
        />

        {/* INVESTIGATION + ADVICE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextArea
            label="Investigation"
            value={form.investigation}
            onChange={(e) => update("investigation", e.target.value)}
            error={errors.investigation}
            loading={loading}
          />

          <TextArea
            label="Advice"
            value={form.advice}
            onChange={(e) => update("advice", e.target.value)}
            error={errors.advice}
            loading={loading}
          />
        </div>

        {/* TREATMENT */}
        <TextArea
          label="Treatment"
          value={form.treatment}
          onChange={(e) => update("treatment", e.target.value)}
          error={errors.treatment}
          loading={loading}
        />

        {/* IMPROVEMENT + CURE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Improvement"
            value={form.improvement}
            onChange={(e) => update("improvement", e.target.value)}
            error={errors.improvement}
            loading={loading}
          />

          <Input
            label="Cure"
            value={form.cure}
            onChange={(e) => update("cure", e.target.value)}
            error={errors.cure}
            loading={loading}
          />
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium transition hover:opacity-90 disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Saving Record..." : "Save Record"}
        </button>
      </form>
    </div>
  );
}