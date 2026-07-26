"use client";

import { useEffect, useState, use } from "react";
import { useParams } from "next/navigation";
import PatientDetail from "@/components/PatientDetail";

export default function PatientDetailPage({ params: paramsPromise }) {
  const params = paramsPromise ? use(paramsPromise) : useParams();
  const patientId = params?.id;

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatientData = async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      const [patientRes, recordsRes] = await Promise.all([
        fetch(`/api/patient/${patientId}`),
        fetch(`/api/record/${patientId}`),
      ]);

      if (patientRes.status === 401 || recordsRes.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (patientRes.ok) {
        setSelectedPatient(await patientRes.json());
      }

      if (recordsRes.ok) {
        setRecords(await recordsRes.json());
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  return (
    <PatientDetail
      patient={selectedPatient}
      records={records}
      loading={loading}
      refreshRecords={fetchPatientData}
      showMobileBack={true}
    />
  );
}
