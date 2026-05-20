import React from "react";
import { STAR_LABELS } from "../data/constants";

export default function StarPicker({ value, onChange }) {
  return (
    <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
      {[2, 3, 4, 5].map(s => (
        <div
          key={s}
          role="radio"
          aria-checked={value === s}
          tabIndex={0}
          onClick={() => onChange(s)}
          onKeyDown={e => (e.key === "Enter" || e.key === " ") && onChange(s)}
          style={{
            flex:1, minWidth:80, border:`2px solid ${value === s ? "#6366f1" : "#e5e7eb"}`,
            borderRadius:12, padding:"14px 10px", textAlign:"center", cursor:"pointer",
            background: value === s ? "#eef2ff" : "#f9fafb",
            boxShadow: value === s ? "0 0 0 3px rgba(99,102,241,0.15)" : "none",
            transition:"all 0.2s", userSelect:"none",
          }}
        >
          <div style={{ fontSize:"1.1rem", marginBottom:4 }}>{"⭐".repeat(s)}</div>
          <div style={{ fontSize:"0.75rem", fontWeight:700, color:"#374151" }}>{STAR_LABELS[s]}</div>
          <div style={{ fontSize:"0.7rem", color:"#6b7280", marginTop:2 }}>
            {["","","Budget","Standard","Premium","Luxury"][s]}
          </div>
        </div>
      ))}
    </div>
  );
}
