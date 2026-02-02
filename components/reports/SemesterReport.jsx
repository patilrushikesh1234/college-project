"use client";

import { useEffect, useState } from "react";
import { loadJSON, getStudentsKey, getAttendanceKey } from "@/utils/storage";

export default function SemesterReport({ classId, subject }) {
  const [report, setReport] = useState([]);

  useEffect(() => {
    if (!subject) return;

    const students = loadJSON(getStudentsKey(classId), []);
    const attendance = loadJSON(getAttendanceKey(classId, subject), {});
    const dates = Object.keys(attendance);

    const result = students.map((s) => {
      const total = dates.length;
      const present = dates.filter((d) => attendance[d]?.[s.roll]).length;
      const absent = total - present;

      return {
        ...s,
        present,
        absent,
        total,
        percent: total ? ((present / total) * 100).toFixed(2) : "0",
      };
    });

    setReport(result);
  }, [classId, subject]);

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2 text-base sm:text-lg">
        Semester Report – {subject}
      </h3>

      {/* Scrollable wrapper for small screens */}
     <div className="overflow-x-auto">
  <table className="w-full border text-xs sm:text-sm bg-white">
    <thead className="bg-blue-600 text-white">
      <tr>
        <th className="px-2 py-1">Roll</th>
        <th className="px-2 py-1">Name</th>
        <th className="px-2 py-1">Present</th>
        <th className="px-2 py-1">Absent</th>
        <th className="px-2 py-1">Total</th>
        <th className="px-2 py-1">%</th>
      </tr>
    </thead>

    <tbody className="bg-white">
      {report.map((r, index) => (
        <tr
          key={r.roll}
          className={`text-center border ${
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }`}
        >
          <td className="px-2 py-1">{r.roll}</td>
          <td className="px-2 py-1">{r.name}</td>
          <td className="px-2 py-1">{r.present}</td>
          <td className="px-2 py-1">{r.absent}</td>
          <td className="px-2 py-1">{r.total}</td>
          <td className="px-2 py-1">{r.percent}%</td>
        </tr>
      ))}
    </tbody>
  </table>
 
      </div>
    </div>
  );
}
