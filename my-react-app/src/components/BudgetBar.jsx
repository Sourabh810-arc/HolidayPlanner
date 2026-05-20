import React from "react";

export default function BudgetBar({ spent, total, label }) {
  const pct  = Math.min((spent / (total || 1)) * 100, 100);
  const over = spent > total;
  return (
    <div style={{ background: over ? "#fef2f2" : "#f0fdf4", border:`1.5px solid ${over ? "#fca5a5" : "#86efac"}`, borderRadius:12, padding:"16px 20px", marginBottom:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
        <span style={{ fontWeight:700, color: over ? "#991b1b" : "#166534", fontSize:"0.9rem" }}>{label}</span>
        <span style={{ fontSize:"1.1rem", fontWeight:700, color: over ? "#dc2626" : "#059669" }}>
          ₹{spent.toLocaleString()} / ₹{total.toLocaleString()}
        </span>
      </div>
      <div style={{ background: over ? "#fee2e2" : "#dcfce7", borderRadius:99, height:10, overflow:"hidden", marginBottom:8 }}>
        <div style={{ height:"100%", borderRadius:99, background: over ? "#ef4444" : "#22c55e", width:`${pct}%`, transition:"width 0.4s" }} />
      </div>
      {over && (
        <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, padding:"10px 14px", marginTop:8, fontSize:"0.85rem", color:"#991b1b" }}>
          ₹{(spent - total).toLocaleString()} over budget — remove some activities or increase your budget.
        </div>
      )}
    </div>
  );
}
