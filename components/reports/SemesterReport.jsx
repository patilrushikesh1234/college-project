"use client";

import { useEffect, useState } from "react";
import { loadJSON, getStudentsKey, getAttendanceKey } from "@/utils/storage";

export default function SemesterReport({ classId }) {
  const [report, setReport] = useState([]);
  const [showSemesterReport, setShowSemesterReport] = useState(false);


  useEffect(() => {
    const students = loadJSON(getStudentsKey(classId), []) || [];
    const attendance = loadJSON(getAttendanceKey(classId), {}) || {};
    const dates = Object.keys(attendance).filter((d) => d !== "__resetDone");
    const result = students.map((stud) => {
      let presentCount = 0;
      let total = 0;
      dates.forEach((date) => {
        const session = attendance[date];
        if (session) {
          total++;
          if (session[stud.roll]) presentCount++;
        }
      });
      const absent = total - presentCount;
      const percent = total ? ((presentCount / total) * 100).toFixed(2) : "0";
      return { roll: stud.roll, name: stud.name, present: presentCount, absent, total, percent };
    });
    setReport(result);
  }, [classId]);

  const exportCSV = () => {
    if (!report.length) { alert("No report data!"); return; }
    let csv = "Roll,Name,Present,Absent,Total,Percentage\n";
    report.forEach((r) => { csv += `${r.roll},${r.name},${r.present},${r.absent},${r.total},${r.percent}%\n`; });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "semester-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-full mx-auto   rounded-xl  ">
      <div>
        <button
          type="button"
          onClick={() => setShowSemesterReport(!showSemesterReport)}
          className="w-full py-3 px-5 text-sm font-semibold rounded-lg bg-[#5484f6] hover:bg-[#144ed8] text-white transition-colors"
        >
          {showSemesterReport ? "Hide Semester Report" : "Show Semester Report"}
        </button>
      </div>
      {showSemesterReport && (
        <>
          <h3 className="text-center mb-2 text-sm md:text-base font-semibold text-gray-800">Semester Report</h3>

          <table className="w-full table-auto border-collapse text-[10px] md:text-xs">
            <thead>
              <tr className="bg-[#1e62ff] text-white font-semibold">
                <th className="py-1 px-1 border border-gray-300 text-center">Roll</th>
                <th className="py-1 px-1 border border-gray-300 text-center">Name</th>
                <th className="py-1 px-1 border border-gray-300 text-center">Present</th>
                <th className="py-1 px-1 border border-gray-300 text-center">Absent</th>
                <th className="py-1 px-1 border border-gray-300 text-center">Total</th>
                <th className="py-1 px-1 border border-gray-300 text-center">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {report.map((r) => (
                <tr key={r.roll} className="even:bg-gray-50">
                  <td className="py-1 px-1 border border-gray-200 text-center">{r.roll}</td>
                  <td className="py-1 px-1 border border-gray-200 text-center">{r.name}</td>
                  <td className="py-1 px-1 border border-gray-200 text-center">{r.present}</td>
                  <td className="py-1 px-1 border border-gray-200 text-center">{r.absent}</td>
                  <td className="py-1 px-1 border border-gray-200 text-center">{r.total}</td>
                  <td className="py-1 px-1 border border-gray-200 text-center">{r.percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-2">
            <button
              onClick={exportCSV}
              className="py-1 px-2 rounded-lg bg-[#4a90e2] hover:bg-[#3579c7] text-white font-semibold text-xs md:text-sm transition-colors"
            >
              Export CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
}
