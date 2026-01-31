"use client";

import { useState } from "react";
import ClassSelector from "@/components/class/ClassSelector";
import StudentManager from "@/components/students/StudentManager";
import AttendanceSession from "@/components/attendance/AttendanceSession";
import SemesterReport from "@/components/reports/SemesterReport";

export default function DashboardContent() {
  const [classId, setClassId] = useState("");

  return (
    <div className="w-full max-w-[900px] mx-auto my-1 p-2 md:p-6 text-center from-cyan-600 to-cyan-500 backdrop-blur-xl rounded-2xl shadow-xl">

      <div className="flex flex-col items-center mb-4">
        <img
          src="/colleg-logo.png"
          alt="S.S.V.P Logo"
          className="w-20 h-20 flex-shrink-0 mx-auto mb-1 hover:scale-110 transition-transform duration-300"
        />


        {/* College Name */}
        <div className="flex flex-col">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold rainbow-text">
            S.S.V.P Sanstha's
          </h2>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold rainbow-text">
            P.R. Ghogre College Dhule
          </h1>
        </div>
      </div>

      <h3 className="text-xl font-semibold underline text-[#402cd5] my-4">Take Smart Attendance</h3>

      <section className="py-1 px-2 my-4 rounded-2xl bg-white/25 backdrop-blur-md shadow-lg hover:bg-white/35 hover:-translate-y-0.5 transition-all duration-200">
        <ClassSelector classId={classId} setClassId={setClassId} />
      </section>

      {classId && (
        <section className="py-2 px-2 my-1 rounded-2xl bg-white/25 backdrop-blur-md shadow-lg hover:bg-white/35 hover:-translate-y-0.5 transition-all duration-200">
          <AttendanceSession classId={classId} />
        </section>
      )}

      {classId && (
        <section className="py-4 px-4 my-4 rounded-2xl bg-white/25 backdrop-blur-md shadow-lg hover:bg-white/35 hover:-translate-y-0.5 transition-all duration-200">
          <StudentManager classId={classId} />
        </section>
      )}

      {classId && (
        <section className="py-4 px-4 my-4 rounded-2xl bg-white/25 backdrop-blur-md shadow-lg hover:bg-white/35 hover:-translate-y-0.5 transition-all duration-200">
          <SemesterReport classId={classId} />
        </section>
      )}

      <div className="mt-2 text-center text-base text-[rgb(7,7,98)] italic">Design by~Rushikesh Patil</div>
    </div>
  );
}
