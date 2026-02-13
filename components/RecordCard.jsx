"use client";

import { motion } from "framer-motion";
import Field from "./Field";

export default function RecordCard({ record }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 rounded-xl shadow mt-4 border-l-4 border-green-500"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="font-bold text-lg text-gray-800">
          Visit Note
        </div>

        <div className="text-sm text-gray-500">
          {new Date(record.date).toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Field label="Complain" value={record.complain} />
        <Field label="Investigation" value={record.investigation} />
        <Field label="Treatment" value={record.treatment} />
        <Field label="Advice" value={record.advice} />
        <Field label="Improvement" value={record.improvement} />
        <Field label="Cure" value={record.cure} />
      </div>
    </motion.div>
  );
}
