import React from "react";

export default function Section({ title, children }) {
  return (
    <div style={{ marginBottom:20, paddingBottom:20, borderBottom:"1px solid #e5e7eb" }}>
      <div style={{ fontWeight:600, color:"#6366f1", marginBottom:8 }}>{title}</div>
      {children}
    </div>
  );
}
