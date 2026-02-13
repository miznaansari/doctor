export default function Field({ label, value }) {
  return (
    <div className="bg-gray-50 p-3 rounded">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium text-gray-800">
        {value || "-"}
      </div>
    </div>
  );
}
