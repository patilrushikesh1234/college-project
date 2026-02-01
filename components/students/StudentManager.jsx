"use client";

import { useState, useEffect } from "react";
import { loadJSON, saveJSON, getStudentsKey, getAttendanceKey } from "@/utils/storage";
import ImportFromSheet from "@/components/import/ImportFromSheet";
import GoogleSheet from "@/components/Links/GoogleSheet";

export default function StudentManager({ classId }) {
  const [students, setStudents] = useState([]);
  const [showManager, setShowManager] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  useEffect(() => {
    if (classId) {
      const key = getStudentsKey(classId);
      const loaded = loadJSON(key, []);
      setStudents(Array.isArray(loaded) ? loaded : []);
    }
  }, [classId]);

  const saveStudents = (list) => {
    const key = getStudentsKey(classId);
    saveJSON(key, list);
    setStudents(list);
  };

  const handleImport = (list) => {
    saveStudents(list);
    setShowImport(false);
  };

  const deleteStudent = (roll) => {
    const updatedList = students.filter((s) => s.roll !== roll);
    saveStudents(updatedList);
  };

  const toggleManager = () => {
    setShowManager((prev) => !prev);
    if (!showManager) setShowImport(false);
  };

  if (!showManager) {
    return (
      <button
        type="button"
        onClick={toggleManager}
        className="
                    w-full
                    py-3 sm:py-3.5
                    px-4 sm:px-6
                    rounded-xl
                    bg-[#4a90e2] hover:bg-[#3579c7]
                    text-white font-semibold
                    text-sm sm:text-base
                    transition-colors
                  ">
        Show Students & Import
      </button>

    );
  }

  return (
    <div className="p-6 max-w-[600px] mx-2 border border-gray-200 rounded-xl bg-gray-50">
      <h3 className="text-center mb-1 text-lg font-semibold text-gray-800">Students – {classId}</h3>
      <div className="mb-2 text-center">
        <span
          onClick={() => setShowSheet(!showSheet)}
          className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-800 underline transition-colors"
        >
          {showSheet ? "Hide Link Section" : "Get Google Sheet Link"}
        </span>
      </div>


      {showSheet && <GoogleSheet selectedClassId={classId} />}



      <button
        type="button"
        className="w-full py-2.5 px-4 mb-4 text-sm font-semibold rounded-lg bg-[#1e62ff] hover:bg-[#144ed8] text-white transition-colors"
        onClick={() => setShowImport((prev) => !prev)}
      >
        {showImport ? "Cancel Student Import" : "Add Students via Google Sheet"}
      </button>
      {showImport && (
        <ImportFromSheet classId={classId} onClose={() => setShowImport(false)} onImport={handleImport} />
      )}

      <h1 className="text-center pb-2 text-xm font-semibold text-gray-900 tracking-wide">
        Students of <span className="text-black-600  ">{classId}</span>
      </h1>


      {students.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2 list-none p-0 max-h-[400px] overflow-y-auto">
          {students.map((s, i) => (
            <li
              key={i}
              className="relative flex items-center justify-between gap-2 p-2 border border-gray-300 rounded-lg bg-gray-100 text-[10px] group"
            >
              {/* Student Name with Tooltip */}
              <span className="flex-1 min-w-0 whitespace-nowrap overflow-hidden text-ellipsis relative cursor-pointer">
                {s.roll} - {s.name}

                {/* Tooltip */}
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                  {s.name}
                </span>
              </span>

              {/* Delete Button */}
              {/* <button
                type="button"
                onClick={() => deleteStudent(s.roll)}
                className="shrink-0 py-1 px-2 text-[10px] text-white border border-red-500 rounded-md bg-red-500 hover:bg-red-600 transition-colors"
              >
                Delete
              </button> */}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center text-[10px]">No students found.</p>
      )}



      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Delete Button */}
        <button
          type="button"
          className="w-full sm:w-auto py-3 px-6 text-sm font-semibold rounded-lg
               bg-red-600 hover:bg-red-700 text-white transition-colors"
          onClick={() => {
            const yes =
              typeof window !== "undefined" &&
              window.confirm(
                "Are you sure? This will erase ALL students and ALL attendance of this class and reset everything."
              );
            if (!yes) return;

            try {
              localStorage.removeItem(getStudentsKey(classId));
              localStorage.removeItem(getAttendanceKey(classId));
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

        {/* Toggle Button */}
        <button
          type="button"
          className="w-full sm:w-auto py-3 px-6 rounded-lg
               bg-[#4a90e2] hover:bg-[#3579c7]
               text-white font-semibold transition-colors"
          onClick={toggleManager}
        >
          Hide Students & Import
        </button>
      </div>

    </div>
  );
}
