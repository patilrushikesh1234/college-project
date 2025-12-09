import React from "react";
import "../../styles/ClassSelector.css";

const DEFAULT_CLASSES = [
  { id: "FYBCA", name: "FY BCA" },
  { id: "SYBCA", name: "SY BCA" },
  { id: "TYBCA", name: "TY BCA" },

  { id: "FYBCS", name: "FY BCS" },
  { id: "SYBCS", name: "SY BCS" },
  { id: "TYBCS", name: "TY BCS" },

  { id: "MSC-COMP-1", name: "MSC COMP -I" },
  { id: "MSC-COMP-2", name: "MSC COMP -II" },

  { id: "MCA-1", name: "MCA-I" },
  { id: "MCA-2", name: "MCA-II" },

];

export default function ClassSelector({ classId, setClassId }) {
  return (
    <div className="class-selector-container">
      <label htmlFor="class-select">Select Class:</label>
      <select
        id="class-select"
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
      >
        <option value="">-- Select --</option>
        {DEFAULT_CLASSES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
} 