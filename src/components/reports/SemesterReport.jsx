import React, { useEffect, useState } from "react";
import { loadJSON } from "../../utils/helpers";
import { getStudentsKey, getAttendanceKey } from "../../utils/storage";
import "../../styles/SemesterReport.css";

export default function SemesterReport({ classId }) {
  const [report, setReport] = useState([]);

  useEffect(() => {
    const students = loadJSON(getStudentsKey(classId), []) || [];
    const attendance = loadJSON(getAttendanceKey(classId), {}) || {};

    // remove reset flag if exists
    const dates = Object.keys(attendance).filter(d => d !== "__resetDone");

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

      return {
        roll: stud.roll,
        name: stud.name,
        present: presentCount,
        absent,
        total,
        percent,
      };
    });

    setReport(result);
  }, [classId]);

  // ------------------------------------
  // EXPORT CSV FUNCTION
  // ------------------------------------
  const exportCSV = () => {
    if (!report.length) return alert("No report data!");

    let csv = "Roll,Name,Present,Absent,Total,Percentage\n";

    report.forEach((r) => {
      csv += `${r.roll},${r.name},${r.present},${r.absent},${r.total},${r.percent}%\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `semester-report.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="semester-report">
      <h3>Semester Report</h3>

      <table>
        <thead>
          <tr>
            <th>Roll</th>
            <th>Name</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Total</th>
            <th>Percentage</th>
          </tr>
        </thead>

        <tbody>
          {report.map((r) => (
            <tr key={r.roll}>
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
      <button className="save-btn" onClick={exportCSV} style={{ marginBottom: "15px" }}>
        Export CSV
      </button>
       
    </div>
  );
}
