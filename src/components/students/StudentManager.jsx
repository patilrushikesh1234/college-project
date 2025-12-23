// src/components/students/StudentManager.jsx
import React, { useState, useEffect } from "react";
import { loadJSON, saveJSON } from "../../utils/helpers";
import { getStudentsKey, getAttendanceKey } from "../../utils/storage";
import ImportFromSheet from "../import/ImportFromSheet";
import "../../styles/StudentManager.css";
import GoogleSheet from "../Links/GoogleSheet";

export default function StudentManager({ classId }) {
  const [students, setStudents] = useState([]);
  const [showManager, setShowManager] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  // Load students safely
  useEffect(() => {
    if (classId) {
      const key = getStudentsKey(classId);
      const loaded = loadJSON(key, []);

      // Safety: ensure array
      setStudents(Array.isArray(loaded) ? loaded : []);
    }
  }, [classId]);

  const saveStudents = (list) => {
    const key = getStudentsKey(classId);
    saveJSON(key, list);
    setStudents(list);
  };

  const handleImport = (list) => {
    // When importing after new semester reset, list is fresh
    saveStudents(list);
    setShowImport(false);
  };

  const deleteStudent = (roll) => {
    const updatedList = students.filter((s) => s.roll !== roll);
    saveStudents(updatedList);
  };

  const toggleManager = () => {
    setShowManager((prev) => !prev);

    // Close import section when hiding manager
    if (!showManager) setShowImport(false);
  };

  // Show only toggle button initially
  if (!showManager) {
    return (
      <button  onClick={toggleManager} className="import-btn">
        Show Students & Import
      </button>
    );
  }

  return (
    <div className="student-manager">
      <h3>Students – {classId}</h3>

      <div>
        <button className="link-section" onClick={() => setShowSheet(!showSheet)}>{showSheet?"Hide Link Section":"Gate Link"}</button>
      </div>

      {
        showSheet && (
          <GoogleSheet selectedClassId={classId} />
        )
      }
      {/* Toggle import */}
      <button
        onClick={() => setShowImport((prev) => !prev)}
        className="import-btn"
      >
        {showImport ? "Hide Import Section" : "Show Import Section"}
      </button>

      {showImport && (
        <ImportFromSheet
          classId={classId}
          onClose={() => setShowImport(false)}
          onImport={handleImport}
        />
      )}

      {/* Student list */}
      {students.length > 0 ? (
        <ul className="student-list">
          {students.map((s, i) => (
            <li key={i}>
              {s.roll}~{s.name}
              <button
                onClick={() => deleteStudent(s.roll)}
                className="delete-btn"
                style={{ marginLeft: "10px", color: "red" }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No students found.</p>
      )}

      {/* ⭐ FULL SEMESTER RESET — SAFE, CLEAN, NON-CORRUPTING ⭐ */}
      <button
        className="erase-all-data"
        onClick={() => {
          const yes = window.confirm(
            "Are you sure? This will erase ALL students and ALL attendance of this class and reset everything."
          );
          if (!yes) return;

          try {
            // Remove storage safely
            localStorage.removeItem(getStudentsKey(classId));
            localStorage.removeItem(getAttendanceKey(classId));

            // Reset React states
            setStudents([]);
            setShowImport(false);

            alert(
              "All class data has been erased successfully! You can now import new students for the next semester."
            );
          } catch (err) {
            console.error("Error clearing semester data:", err);
            alert("An error occurred while deleting data, but your site is safe.");
          }
        }}
      >
        Delete All Data (Semester Reset)
      </button>


      {/* Hide manager */}
      <button
        onClick={toggleManager}
        className="import-btn"
        style={{ marginTop: "10px" }}
      >
        Hide Students & Import
      </button>
    </div>
  );
}
