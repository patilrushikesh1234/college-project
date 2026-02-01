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
      let present = 0;
      dates.forEach((d) => {
        if (attendance[d]?.[s.roll]) present++;
      });
      const total = dates.length;
      return {
        ...s,
        present,
        absent: total - present,
        total: present + absent,
        percent: total ? ((present / total) * 100).toFixed(2) : "0",
      };
    });

    setReport(result);
  }, [classId, subject]);

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">
        Semester Report – {subject}
      </h3>

      <table className="w-full border text-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th>Roll</th>
            <th>Name</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Total</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {report.map((r) => (
            <tr key={r.roll} className="text-center border">
              <td>{r.roll}</td>
              <td>{r.name}</td>
              <td>{r.present}</td>
              <td>{r.absent}</td>
              <td>{r.total}</td>
              <td>{r.percent}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
