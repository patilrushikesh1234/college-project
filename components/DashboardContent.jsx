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
    <div className="max-w-[900px] mx-auto p-4">


      <div className="flex justify-center  gap-4">
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


      <ClassSelector classId={classId} setClassId={setClassId} />

      {classId && (
        <SubjectSelector
          classId={classId}
          subject={subject}
          setSubject={setSubject}
        />
      )}

      {classId && subject && (
        <AttendanceSession classId={classId} subject={subject} />
      )}

      <div className="my-4   ">
        {classId && subject && (
          <StudentManager classId={classId} />
        )}
      </div>

      <div className="my-4   ">
        {classId && subject && (
          <button
            onClick={() => setShowReport((prev) => !prev)}
            className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-700 text-white font-semibold mb-2"
          >
            {showReport ? "Hide Semester Report" : "Show Semester Report"}
          </button>
        )}
        {showReport && classId && subject && (
          <SemesterReport classId={classId} subject={subject} />
        )}
      </div>

      <Link href="/getLink">
        <div >
          <p className="text-center text-sm text-gray-500 mt-8">
            &copy; {new Date().getFullYear()} P.R. Ghogre College Dhule. All rights reserved.
          </p>
        </div>
        <div>
          <p className=" right-10 text-center italic text-sm text-gray-500">
            Developed by Rushikesh Patil.
          </p>
        </div>
      </Link>

    </div>
  );
}
