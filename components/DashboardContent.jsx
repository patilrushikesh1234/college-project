"use client";
import { useState } from "react";
import ClassSelector from "@/components/class/ClassSelector";
import SubjectSelector from "@/components/subject/SubjectSelector";
import StudentManager from "@/components/students/StudentManager";
import AttendanceSession from "@/components/attendance/AttendanceSession";
import SemesterReport from "@/components/reports/SemesterReport";
import Link from "next/link";
export default function DashboardContent() {
  const [classId, setClassId] = useState("");
  const [subject, setSubject] = useState("");
  const [showReport, setShowReport] = useState(false);


  return (
    <div className="max-w-[900px]    mx-auto p-4">

      {/* Header */}
      <div className="flex justify-center gap-4 mb-6">
        <img
          src="/colleg-logo.png"
          alt="college logo"
          className="w-20 h-20 object-contain border rounded-lg"
        />
        <div className="flex flex-col">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold rainbow-text">
            S.S.V.P Sanstha's
          </h2>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold rainbow-text">
            P.R. Ghogre College Dhule
          </h1>
        </div>
      </div>

      {/* Class Selector */}
      <div className="max-w-[700px] mx-auto">
        <ClassSelector classId={classId} setClassId={setClassId} />
      </div>

      {/* Subject Selector */}
      {classId && (
        <div className="max-w-[700px] mx-auto mt-4">
          <SubjectSelector
            classId={classId}
            subject={subject}
            setSubject={setSubject}
          />
        </div>
      )}

      {/* Attendance Session */}
      {classId && subject && (
        <div className="max-w-[700px] mx-auto mt-4">
          <AttendanceSession classId={classId} subject={subject} />
        </div>
      )}

      {/* Student Import */}
      {classId && subject && (
        <div className="my-4 max-w-[700px] mx-auto">
          <StudentManager classId={classId} />
        </div>
      )}

      {/* Semester Report */}
      {classId && subject && (
        <div className="my-6 max-w-[700px] mx-auto text-center">
          <button
            onClick={() => setShowReport((prev) => !prev)}
            className="w-full sm:w-auto sm:px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-700 text-white font-semibold mb-3 mx-auto block"
          >
            {showReport ? "Hide Semester Report" : "Show Semester Report"}
          </button>

          {showReport && (
            <SemesterReport classId={classId} subject={subject} />
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-10">
        <p className="text-center text-sm text-gray-100">
          &copy; {new Date().getFullYear()} P.R. Ghogre College Dhule. All rights reserved.
        </p>
        <p className="text-center italic text-sm text-gray-100">
          Developed by Rushikesh Patil.
        </p>
      </div>

    </div>

  );
}
