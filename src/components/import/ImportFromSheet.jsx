import React, { useState } from "react";
import { saveJSON } from "../../utils/helpers";
import { getStudentsKey } from "../../utils/storage";
import "../../styles/ImportFromSheet.css";

export default function ImportFromSheet({ classId, onClose, onImport }) {
  const [sheetUrl, setSheetUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // improved extractor: supports multiple google sheet url formats and builds export CSV url
  const extractCSV = (rawUrl) => {
    if (!rawUrl) return null;

    const url = rawUrl.trim();

    if (!url.includes("docs.google.com/spreadsheets")) return null;

    // try /d/<id>/... form OR ?id=<id>
    let idMatch =
      url.match(/\/d\/([a-zA-Z0-9-_]+)/) ||
      url.match(/[?&]id=([a-zA-Z0-9-_]+)/);

    if (!idMatch) return null;

    const sheetId = idMatch[1];

    // try to get gid (sheet tab)
    const gidMatch = url.match(/[?&]gid=(\d+)/);
    const gid = gidMatch ? gidMatch[1] : "0";

    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  };

  // simple CSV parser that handles quoted fields and commas inside quotes
  const parseCSV = (text) => {
    const rows = [];
    let field = "";
    let row = [];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];

      if (ch === '"') {
        if (inQuotes && text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (ch === "," && !inQuotes) {
        row.push(field);
        field = "";
        continue;
      }

      if ((ch === "\n" || ch === "\r") && !inQuotes) {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        if (field !== "" || row.length > 0) {
          row.push(field);
          rows.push(row);
          row = [];
          field = "";
        }
        continue;
      }

      field += ch;
    }

    if (field !== "" || row.length > 0) {
      row.push(field);
      rows.push(row);
    }

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

      // If HTML returned instead of CSV
      if (
        contentType.includes("text/html") ||
        /<!doctype html/i.test(text)
      ) {
        console.error(
          "ImportFromSheet: received HTML instead of CSV",
          text.slice(0, 500)
        );
        alert(
          "Sheet is not public. Set: 'Anyone with the link → Viewer' or 'Publish to web'."
        );
        setLoading(false);
        return;
      }

      const rows = parseCSV(text);

      if (rows.length <= 1) {
        alert("No data found in the sheet.");
        setLoading(false);
        return;
      }

      const list = rows.slice(1).map((r) => ({
        roll: (r[0] || "").trim(),
        name: (r[1] || "").trim(),
      }));

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
    <div className="sheet-popup">
      <div className="popup-box">
        <h3>Import From Google Sheet</h3>

        <input
          type="text"
          placeholder="Paste Google Sheet URL here"
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
        />

        <button onClick={importSheet} disabled={loading}>
          {loading ? "Importing..." : "Import"}
        </button>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
