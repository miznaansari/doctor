"use client";

import { useState } from "react";
import toast from "react-hot-toast";

/* Move Input outside */
function Input({ label, name, type = "text", form, errors, update }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>

      <input
        type={type}
        value={form[name]}
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
}

export default function AddPatientForm({ refreshPatients }) {
  const initialForm = {
    patientName: "",
    age: "",
    fatherName: "",
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

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrors({});

    const toastId = toast.loading("Creating patient...");

    try {
      const res = await fetch("/api/patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.dismiss(toastId);

        if (data.errors) {
          setErrors(data.errors);
        } else {
          toast.error(data.error);
        }

        setLoading(false);
        return;
      }

      toast.dismiss(toastId);
      toast.success("Patient created");

      setForm(initialForm);
      refreshPatients();
    } catch {
      toast.dismiss(toastId);
      toast.error("Network error");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={submit}
      className="p-4 border-t space-y-3 bg-gray-50"
    >
      <div className="font-semibold text-gray-700">
        Add New Patient
      </div>

      <Input
        label="Patient Name"
        name="patientName"
        form={form}
        errors={errors}
        update={update}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Age"
          name="age"
          type="number"
          form={form}
          errors={errors}
          update={update}
        />

        <Input
          label="Father Name"
          name="fatherName"
          form={form}
          errors={errors}
          update={update}
        />
      </div>

      <Input
        label="Address"
        name="address"
        form={form}
        errors={errors}
        update={update}
      />

      <button
        disabled={loading}
        className="bg-green-600 text-white w-full p-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Saving..." : "Add Patient"}
      </button>
    </form>
  );
}
