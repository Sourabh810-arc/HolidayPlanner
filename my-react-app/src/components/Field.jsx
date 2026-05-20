import React from "react";

export default function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom:25 }}>
      <label style={{ display:"block", fontWeight:600, color:"#374151", marginBottom:8, fontSize:"0.9rem" }}>{label}</label>
      {children}
      {error && <div style={{ color:"#ef4444", fontSize:"0.85rem", marginTop:4 }}>{error}</div>}
    </div>
  );
}
