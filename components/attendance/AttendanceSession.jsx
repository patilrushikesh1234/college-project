"use client";

import { useEffect, useState } from "react";
import {
  loadJSON,
  saveJSON,
  getAttendanceKey,
  getStudentsKey
} from "@/utils/storage";

export default function AttendanceSession({ classId, subject }) {
  const formatToShortDate = (isoDate) => {
    const [y, m, d] = isoDate.split("-");
    return `${d}.${m}.${y.slice(2)}`;
  };

  const [students, setStudents] = useState([]);
  const [present, setPresent] = useState({});
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const stud = loadJSON(getStudentsKey(classId), []);
    setStudents(stud || []);
  }, [classId]);

  useEffect(() => {
    if (!date || !subject) return;
    const key = getAttendanceKey(classId, subject);
    const data = loadJSON(key, {});
    setPresent(data[formatToShortDate(date)] || {});
  }, [classId, subject, date]);

  const toggle = (roll) =>
    setPresent((p) => ({ ...p, [roll]: !p[roll] }));

  const save = () => {
    const key = getAttendanceKey(classId, subject);
    const existing = loadJSON(key, {});
    const shortDate = formatToShortDate(date);
    existing[shortDate] = present;
    saveJSON(key, existing);
    alert(`Attendance saved for ${subject}`);
  };

  // ✅ EXPORT CSV FEATURE
  const exportCSV = () => {
    const key = getAttendanceKey(classId, subject);
    const attendance = loadJSON(key, {});

    const dates = Object.keys(attendance).sort();
    if (!dates.length) {
      alert("No attendance data found!");
      return;
    }

    let csv = "Roll,Name," + dates.join(",") + "\n";

    students.forEach((s) => {
      let row = `${s.roll},${s.name}`;
      dates.forEach((d) => {
        row += `,${attendance[d]?.[s.roll] ? "P" : "A"}`;
      });
      csv += row + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${classId}_${subject}_attendance.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[600px] mx-auto p-3 rounded-xl bg-white shadow-md">
      <h3 className="font-semibold mb-3">
        Attendance of – {subject}
      </h3>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-4 p-2 border rounded-lg w-full"
      />

      <div className="grid grid-cols-5 gap-2 mb-4">
        {students.map((s) => (
          <div
            key={s.roll}
            onClick={() => toggle(s.roll)}
            className={`cursor-pointer p-2 text-center rounded-full font-semibold border border-gray-600  
              ${present[s.roll] ? "bg-green-400" : "bg-red-400"}`}
          >
            {s.roll}
          </div>
        ))}
      </div>

      <button
        onClick={save}
        className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold mb-2"
      >
        Save Attendance
      </button>

      {/* ✅ Export CSV Button */}
      <button
        onClick={exportCSV}
        className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
      >
        Export CSV
      </button>
    </div>
  );
}
