import React, { useState } from "react";
import ClassSelector from "./components/class/ClassSelector";
import StudentManager from "./components/students/StudentManager";
import AttendanceSession from "./components/attendance/AttendanceSession";
import SemesterReport from "./components/reports/SemesterReport";
import "./styles/App.css";

export default function App() {
  const [classId, setClassId] = useState("");

  return (
    <div className="app-container">

      {/* Logo + College Titles */}
      <div className="header-row">

        <div className="ssvps">
          <h2>S.S.V.P Sanstha's</h2>
        </div>

        <div className="college-name">
          <h2>PRG Science College Dhule</h2>
        </div>
      </div>

      <h3 id="h3">Take Smart Attendance</h3>
      <div className="app-section">
        <ClassSelector classId={classId} setClassId={setClassId} />
      </div>

      {classId && (
        <div className="app-section">
          <StudentManager classId={classId} />
        </div>
      )}

      {classId && (
        <div className="app-section">
          <AttendanceSession classId={classId} />
        </div>
      )}

      {classId && (
        <div className="app-section">
          <SemesterReport classId={classId} />
        </div>
      )}

      <div className="owner">
        <i> Design by~Rushikesh Patil</i>
      </div>

    </div>
  );
}
