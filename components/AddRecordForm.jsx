"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AddRecordForm({
  selectedPatient,
  refreshRecords,
}) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    setForm({ ...form, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: null });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const toastId = toast.loading("Saving visit record...");

    try {
      const res = await fetch("/api/record", {
        method: "POST",
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
          toast.error(data.error);
        }
        setLoading(false);
        return;
      }

      toast.dismiss(toastId);
      toast.success("Visit record saved");

      setForm({});
      refreshRecords();
    } catch {
      toast.dismiss(toastId);
      toast.error("Network error");
    }

    setLoading(false);
  };

  const Input = ({ label, name, type = "text" }) => (
    <div>
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        type={type}
        className={`input mt-1 ${
          errors[name] ? "border-red-500" : ""
        }`}
        onChange={(e) => update(name, e.target.value)}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm">{errors[name]}</p>
      )}
    </div>
  );

  const TextArea = ({ label, name }) => (
    <div>
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>
      <textarea
        rows={3}
        className={`input mt-1 ${
          errors[name] ? "border-red-500" : ""
        }`}
        onChange={(e) => update(name, e.target.value)}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <form
      onSubmit={submit}
      className="bg-white p-5 mt-4 rounded-xl shadow space-y-4"
    >
      <div className="font-semibold text-gray-700 border-b pb-2">
        Add Visit Record
      </div>

      {/* Date */}
      <Input label="Visit Date" name="date" type="date" />

      {/* Complain */}
      <TextArea label="Complain" name="complain" />

      {/* Investigation + Advice */}
      <div className="grid grid-cols-2 gap-4">
        <TextArea label="Investigation" name="investigation" />
        <TextArea label="Advice" name="advice" />
      </div>

      {/* Treatment */}
      <TextArea label="Treatment" name="treatment" />

      {/* Improvement + Cure */}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Improvement" name="improvement" />
        <Input label="Cure" name="cure" />
      </div>

      <button
        disabled={loading}
        className="bg-green-600 text-white w-full p-3 rounded-lg font-medium disabled:opacity-50"
      >
        {loading ? "Saving Record..." : "Save Record"}
      </button>
    </form>
  );
}
