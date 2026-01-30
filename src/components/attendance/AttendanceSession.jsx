import React, { useEffect, useState } from "react";
import { loadJSON, saveJSON } from "../../utils/helpers";
import { getAttendanceKey, getStudentsKey } from "../../utils/storage";
import "../../styles/AttendanceSession.css";

export default function AttendanceSession({ classId }) {

  // -------------------------------
  // DATE FORMAT HELPERS
  // -------------------------------
  const formatToShortDate = (isoDate) => {
    const [y, m, d] = isoDate.split("-");
    return `${d}.${m}.${y.slice(2)}`;
  };

  const formatToISO = (shortDate) => {
    const [d, m, y] = shortDate.split(".");
    return `20${y}-${m}-${d}`;
  };

  // -------------------------------
  // AUTO RESET ON 1 MAY
  // -------------------------------
  const isNewAcademicYear = () => {
    const today = new Date();
    const month = today.getMonth(); // 0 = Jan, 4 = May
    const day = today.getDate();

    // If date >= 1 May → start new academic year
    if (month > 3) return true;
    if (month === 3 && day >= 1) return true;
    return false;
  };

  const resetIfNeeded = (attendance) => {
    if (!isNewAcademicYear()) return attendance;

    // Already fresh? Don't reset again.
    if (attendance.__resetDone === true) return attendance;

    return {
      __resetDone: true,  // mark as reset once
      // keep students, remove all dates:
      ...attendance,
      ...{},
    };
  };

  // -------------------------------
  // STATES
  // -------------------------------
  const [students, setStudents] = useState([]);
  const [present, setPresent] = useState({});
  const [date, setDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });

  // -------------------------------
  // LOAD STUDENTS
  // -------------------------------
  useEffect(() => {
    const stud = loadJSON(getStudentsKey(classId), []) || [];
    setStudents(Array.isArray(stud) ? stud : []);
  }, [classId]);

  // -------------------------------
  // LOAD ATTENDANCE FOR SELECTED DATE
  // -------------------------------
  useEffect(() => {
    if (!date) return;

    const key = getAttendanceKey(classId);
    let attendanceData = loadJSON(key, {}) || {};

    // AUTO RESET ON 1 MAY
    attendanceData = resetIfNeeded(attendanceData);
    saveJSON(key, attendanceData);

    const shortDate = formatToShortDate(date);
    setPresent(attendanceData[shortDate] || {});
  }, [classId, date]);

  // -------------------------------
  // MARK PRESENT/ABSENT
  // -------------------------------
  const toggle = (roll) => {
    setPresent((prev) => ({ ...prev, [roll]: !prev[roll] }));
  };

  // -------------------------------
  // SAVE ATTENDANCE
  // -------------------------------
  const save = () => {
    if (!date) return alert("Please select a date!");

    const key = getAttendanceKey(classId);
    let existing = loadJSON(key, {}) || {};

    // AUTO RESET ON 1 MAY
    existing = resetIfNeeded(existing);

    const shortDate = formatToShortDate(date);
    existing[shortDate] = present;

    saveJSON(key, existing);
    alert(`Attendance saved for ${shortDate}!`);
  };

  // -------------------------------
  // EXPORT CSV
  // -------------------------------
  const exportCSV = () => {
    const key = getAttendanceKey(classId);
    const attendanceData = loadJSON(key, {}) || {};

    if (!students?.length) {
      alert("No students found!");
      return;
    }

    const dates = Object.keys(attendanceData)
      .filter(d => d !== "__resetDone")
      .sort();

    if (!dates.length) {
      alert("No attendance data found!");
      return;
    }

    let csv = "Roll Number,Name," + dates.join(",") + "\n";

    students.forEach(s => {
      let row = `${s.roll},${s.name}`;

      dates.forEach(d => {
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



  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="attendance-session">
      <h3>Mark Attendance</h3>

      <div className="date-select">
        <label>Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="students-grid">
        {students.map((s) => (
          <div
            key={s.roll}
            className={`student-roll ${present[s.roll] ? "present" : ""}`}
            onClick={() => toggle(s.roll)}
          >
            {s.roll}
          </div>
        ))}
      </div>

      <button onClick={save} className="save-btn">
        Save Attendance
      </button>

      <button
        onClick={exportCSV}
        className="save-btn"
        style={{ marginTop: "10px" }}
      >
        Export CSV
      </button>
    </div>
  );
}
