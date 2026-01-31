"use client";

import { useEffect, useState } from "react";
import { loadJSON, saveJSON, getAttendanceKey, getStudentsKey } from "@/utils/storage";

export default function AttendanceSession({ classId }) {
  const formatToShortDate = (isoDate) => {
    const [y, m, d] = isoDate.split("-");
    return `${d}.${m}.${y.slice(2)}`;
  };

  const isNewAcademicYear = () => {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();
    if (month > 3) return true;
    if (month === 3 && day >= 1) return true;
    return false;
  };

  const resetIfNeeded = (attendance) => {
    if (!isNewAcademicYear()) return attendance;
    if (attendance.__resetDone === true) return attendance;
    return { __resetDone: true, ...attendance };
  };

  const [students, setStudents] = useState([]);
  const [present, setPresent] = useState({});
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const stud = loadJSON(getStudentsKey(classId), []) || [];
    setStudents(Array.isArray(stud) ? stud : []);
  }, [classId]);

  useEffect(() => {
    if (!date) return;
    const key = getAttendanceKey(classId);
    let attendanceData = loadJSON(key, {}) || {};
    attendanceData = resetIfNeeded(attendanceData);
    saveJSON(key, attendanceData);
    const shortDate = formatToShortDate(date);
    setPresent(attendanceData[shortDate] || {});
  }, [classId, date]);

  const toggle = (roll) => setPresent((prev) => ({ ...prev, [roll]: !prev[roll] }));

  const save = () => {
    if (!date) { alert("Please select a date!"); return; }
    const key = getAttendanceKey(classId);
    let existing = loadJSON(key, {}) || {};
    existing = resetIfNeeded(existing);
    const shortDate = formatToShortDate(date);
    existing[shortDate] = present;
    saveJSON(key, existing);
    alert(`Attendance saved for ${shortDate}!`);
  };

  const exportCSV = () => {
    const key = getAttendanceKey(classId);
    const attendanceData = loadJSON(key, {}) || {};
    if (!students?.length) { alert("No students found!"); return; }
    const dates = Object.keys(attendanceData).filter((d) => d !== "__resetDone").sort();
    if (!dates.length) { alert("No attendance data found!"); return; }
    let csv = "Roll Number,Name," + dates.join(",") + "\n";
    students.forEach((s) => {
      let row = `${s.roll},${s.name}`;
      dates.forEach((d) => {
        const isPresent = attendanceData[d]?.[s.roll];
        row += `,${isPresent ? "P" : "A"}`;
      });
      csv += row + "\n";
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance-summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full lg:w-full max-w-[700px] mx-auto mt-1 p-2 rounded-2xl bg-white/20 backdrop-blur-md shadow-xl">
      <h3 className="text-center mb-4 text-xl font-semibold text-gray-900">Mark Attendance</h3>
      <div className="flex flex-col gap-1 mb-4 py-2 px-[5%] rounded-xl bg-white/20 backdrop-blur-sm shadow-md">
        <label className="text-sm font-semibold text-gray-800">Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="py-2 px-2.5 rounded-xl border border-gray-300 bg-white/80 text-gray-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400/50"
        />
      </div>
      <div className="grid grid-cols-5 gap-3 mb-5">
        {students.map((s) => (
          <div
            key={s.roll}
            onClick={() => toggle(s.roll)}
            className={`flex items-center justify-center
              rounded-full
              text-[14px] md:text-[15px] font-semibold
              cursor-pointer transition-all hover:scale-105
              w-15 h-10 md:w-12 md:h-24 lg:w-24 lg:h-14
              ${present[s.roll]
                ? "bg-green-200/80 border-2 border-green-600 text-green-700"
                : "bg-red-200/80 border-2 border-red-600 text-red-600"
              }`}
          >
            {s.roll}
          </div>

        ))}
      </div>
      <button type="button" onClick={save} className="w-full py-3.5 mt-2.5 rounded-xl bg-[#4a90e2] hover:bg-[#3579c7] hover:-translate-y-0.5 text-white text-lg font-semibold shadow-md transition-all">Save Attendance</button>
      <button type="button" onClick={exportCSV} className="w-full py-3.5 mt-2.5 rounded-xl bg-[#4a90e2] hover:bg-[#3579c7] hover:-translate-y-0.5 text-white text-lg font-semibold shadow-md transition-all">Export CSV</button>
    </div>
  );
}
