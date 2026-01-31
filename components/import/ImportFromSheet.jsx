"use client";

import { useState } from "react";
import { saveJSON, getStudentsKey } from "@/utils/storage";

export default function ImportFromSheet({ classId, onClose, onImport }) {
  const [sheetUrl, setSheetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const extractCSV = (rawUrl) => {
    if (!rawUrl) return null;
    const url = rawUrl.trim();
    if (!url.includes("docs.google.com/spreadsheets")) return null;
    const idMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/) || url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (!idMatch) return null;
    const sheetId = idMatch[1];
    const gidMatch = url.match(/[?&]gid=(\d+)/);
    const gid = gidMatch ? gidMatch[1] : "0";
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  };

  const parseCSV = (text) => {
    const rows = [];
    let field = "";
    let row = [];
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '"') {
        if (inQuotes && text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = !inQuotes; }
        continue;
      }
      if (ch === "," && !inQuotes) { row.push(field); field = ""; continue; }
      if ((ch === "\n" || ch === "\r") && !inQuotes) {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        if (field !== "" || row.length > 0) { row.push(field); rows.push(row); row = []; field = ""; }
        continue;
      }
      field += ch;
    }
    if (field !== "" || row.length > 0) { row.push(field); rows.push(row); }
    return rows;
  };

  const importSheet = async () => {
    const csvUrl = extractCSV(sheetUrl);
    if (!csvUrl) {
      alert("Invalid Google Sheet URL. Use a valid docs.google.com sheet link.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(csvUrl, { mode: "cors" });
      const contentType = res.headers.get("content-type") || "";
      const text = await res.text();
      if (contentType.includes("text/html") || /<!doctype html/i.test(text)) {
        alert("Sheet is not public. Set: 'Anyone with the link → Viewer' or 'Publish to web'.");
        setLoading(false);
        return;
      }
      const rows = parseCSV(text);
      if (rows.length <= 1) { alert("No data found in the sheet."); setLoading(false); return; }
      const list = rows.slice(1).map((r) => ({ roll: (r[0] || "").trim(), name: (r[1] || "").trim() }));
      const key = getStudentsKey(classId);
      saveJSON(key, list);
      onImport(list);
      alert("Students imported successfully!");
      onClose();
    } catch (err) {
      console.error("ImportFromSheet error:", err);
      alert("Error importing sheet. Check console for details.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
      <div className="w-full max-w-[500px] mx-4 rounded-xl bg-white p-6 shadow-xl flex flex-col gap-4">
        <h3 className="text-center text-lg font-semibold text-gray-800 m-0">Import From Google Sheet</h3>
        <input
          type="text"
          placeholder="Paste Google Sheet URL here"
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
          className="w-full py-3 px-4 text-sm rounded-lg border border-gray-300 outline-none focus:border-[#1e62ff] focus:ring-2 focus:ring-[#1e62ff]/20 transition-all"
        />
        <button type="button" onClick={importSheet} disabled={loading} className="py-2.5 px-4 text-sm font-semibold rounded-lg bg-[#1e62ff] hover:bg-[#144ed8] disabled:opacity-60 text-white transition-all">
          {loading ? "Importing..." : "Import"}
        </button>
        <button type="button" className="py-2.5 px-4 text-sm font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
