export default function PatientHeader({ patient }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold text-lg">{patient.patientName}</h2>
      <p>Age: {patient.age}</p>
      <p>Father: {patient.fatherName}</p>
      <p>{patient.address}</p>
    </div>
  );
}
