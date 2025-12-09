// ...existing code...
import React, { useState } from "react";
import { saveJSON } from "../../utils/helpers";
import { getStudentsKey } from "../../utils/storage";
import "../../styles/ImportFromSheet.css";


export default function ImportFromSheet({ classId, onClose, onImport }) {
  const [sheetUrl, setSheetUrl] = useState("");
  const [loading, setLoading] = useState(false);


  // improved extractor: supports multiple google sheet url formats and builds export CSV url
  const extractCSV = (url) => {
    if (!url || !url.includes("docs.google.com")) return null;

    // try /d/<id>/... form
    let idMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    let gidMatch = url.match(/[?&]gid=(\d+)/);

    // try open?id=... form
    if (!idMatch) {
      const openMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
      if (openMatch) idMatch = openMatch;
    }

    const id = idMatch ? idMatch[1] : null;
    const gid = gidMatch ? gidMatch[1] : "0";

    if (!id) return null;

    return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
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
        // handle double-quote escaping ("")
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
        // handle CRLF by skipping extra char
        if (ch === "\r" && text[i + 1] === "\n") { /* skip next */ }
        if (field !== "" || row.length > 0) {
          row.push(field);
          rows.push(row);
          row = [];
          field = "";
        }
        // skip possible LF after CR
        if (ch === "\r" && text[i + 1] === "\n") i++;
        continue;
      }
      field += ch;
    }
    // push last field/row
    if (field !== "" || row.length > 0) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  };


  const importSheet = async () => {
    const csvUrl = extractCSV(sheetUrl);
    if (!csvUrl) return alert("Invalid Google Sheet URL. Use a sheet link (docs.google.com)");

    // show loader
    setLoading(true);

    try {
      const res = await fetch(csvUrl, { mode: "cors" });

      const contentType = res.headers.get("content-type") || "";
      const text = await res.text();

      // if server returned HTML, it's likely an auth page or error
      if (contentType.includes("text/html") || /<!doctype html/i.test(text)) {
        console.error("ImportFromSheet: received HTML response (likely sign-in or permissions). Response snippet:", text.slice(0, 1000));
        alert("Received HTML instead of CSV. Make sure the sheet is shared: set 'Anyone with the link can view' or 'Publish to web'.");
        setLoading(false);
        return;
      }

      const rows = parseCSV(text);
      if (rows.length <= 1) {
        alert("No data found in the sheet.");
        setLoading(false);
        return;
      }

      const list = rows.slice(1).map(r => ({ roll: (r[0] || "").trim(), name: (r[1] || "").trim() }));

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
  // ...existing code...
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


        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}