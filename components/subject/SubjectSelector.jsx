"use client";

import { useEffect, useState } from "react";
import { loadJSON, saveJSON, getSubjectsKey } from "@/utils/storage";

export default function SubjectSelector({ classId, subject, setSubject }) {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [showAddSubject, setShowAddSubject] = useState(false);

  useEffect(() => {
    if (!classId) return;
    const stored = loadJSON(getSubjectsKey(classId), []);
    setSubjects(Array.isArray(stored) ? stored : []);
    setSubject("");
  }, [classId]);

  const addSubject = () => {
    if (!newSubject.trim()) return;
    if (subjects.includes(newSubject.trim())) return;

    const updated = [...subjects, newSubject.trim()];
    setSubjects(updated);
    saveJSON(getSubjectsKey(classId), updated);
    setNewSubject("");
  };

  return (
    <div className="max-w-[600px] mx-auto my-4 p-4 sm:p-6 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg">
      {subjects.length === 0 && (
        <p className="text-sm sm:text-base text-red-600 mb-4">
          No subjects found for this class. Please add a new subject.
        </p>
      )

      }

      <div className="flex gap-5 items-center">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 justify-start  sm:text-left">
            Select Subject :
          </h3>
        </div>

        {/* Dropdown */}
        <div>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-auto p-3 sm:p-3 mb-3 border border-gray-300 rounded-md bg-gray-50 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition
             overflow-y-auto max-h-40"
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>


      {/* Add new subject */}
      {showAddSubject ? (
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
          <input
            type="text"
            placeholder="Enter subject name..."
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className=" w-full flex-1 p-2 sm:p-3 border border-gray-300 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition placeholder-gray-400"
          />
          <button
            onClick={addSubject}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base transition-transform active:scale-[0.97]"
          >
            Add
          </button>
        </div>
      ) : (
        <p
          onClick={() => setShowAddSubject(true)}
          className="cursor-pointer text-blue-600 hover:underline font-medium text-sm justify-center sm:text-base"
        >
          + Add New Subject
        </p>
      )}

      {showAddSubject === true && (
        <p
          onClick={() => setShowAddSubject(false)}
          className="cursor-pointer text-center underline text-red-600 hover:underline font-medium text-sm sm:text-base mt-2"
        >
          Close
        </p>
      )}
    </div>

  );
}
