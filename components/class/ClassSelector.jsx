"use client";

import { CLASSES } from "@/utils/constants";

export default function ClassSelector({ classId, setClassId }) {
  return (
    <div className="max-w-[600px] mx-auto my-3 py-3 px-2 border border-gray-200 rounded-xl bg-white shadow-md flex flex-wrap items-center gap-4">
      <label htmlFor="class-select" className="font-semibold text-base text-gray-800 min-w-[120px]">Select Class:</label>
      <select
        id="class-select"
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
        className="flex-1 min-w-[180px] max-w-[250px] py-3 px-4 text-[15px] border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-[#1e62ff] focus:outline-none focus:border-[#1e62ff] focus:ring-2 focus:ring-[#1e62ff]/30 transition-all"
      >
        <option value="">-- Select --</option>
        {CLASSES.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
