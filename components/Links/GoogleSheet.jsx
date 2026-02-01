"use client";

import { useEffect, useState } from "react";
import { CLASSES } from "@/utils/constants";

const STORAGE_KEY = "class_google_sheets";

export default function GoogleSheet({ selectedClassId }) {
  const [links, setLinks] = useState({});

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") : null;
      if (stored && typeof stored === "object") setLinks(stored);
    } catch (err) { console.error("Failed to load links", err); }
  }, []);

  const saveLinks = (updated) => {
    setLinks(updated);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleChange = (classId, value) => saveLinks({ ...links, [classId]: value });

  const copyLink = async (classId) => {
    const link = links[classId];
    if (!link) { alert("No link to copy"); return; }
    try {
      await navigator.clipboard.writeText(link);
      alert("Link copied to clipboard ✅");
    } catch (err) { alert("Failed to copy link ❌"); }
  };

  const selectedClass = CLASSES.filter((cls) => cls.id === selectedClassId);
  if (!selectedClassId) return <p className="text-gray-600">No class selected.</p>;

  return (
    <div className=" px-1 max-w-md mx-1 space-y-2">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Google Sheet Link for {selectedClass[0]?.name}
        </h2>
        <marquee behavior="" direction="">
          <p className="mt-1 text-sm text-red-600">
            Paste your Google Sheet link below. It will be saved automatically for future access.
          </p>
        </marquee>
      </div>

      {/* Link Input Cards */}
      {selectedClass.map((cls) => (
        <div
          key={cls.id}
          className="flex flex-col sm:flex-row items-center sm:space-x-3
                 p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm"
        >
          {/* Input */}
          <input
            type="url"
            placeholder="Paste Google Sheet link here"
            value={links[cls.id] || ""}
            onChange={(e) => handleChange(cls.id, e.target.value)}
            className="flex-1 w-full sm:w-auto py-2 px-3 text-sm
                   border border-gray-300 rounded-md outline-none
                   focus:border-blue-600 focus:ring-1 focus:ring-blue-600 mb-3 sm:mb-0"
          />

          {/* Copy Button */}
          <button
            type="button"
            onClick={() => copyLink(cls.id)}
            className="py-2 px-5 text-sm font-medium text-white
                   bg-blue-600 hover:bg-blue-700 rounded-md
                   transition-transform active:scale-[0.97] w-full sm:w-auto"
          >
            Copy Link
          </button>
        </div>
      ))}
    </div>

  );
}
