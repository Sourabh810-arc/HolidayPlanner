import { useState, useCallback } from "react";
import { HOTEL_RATIO_CAB, HOTEL_RATIO_NO_CAB, TRANSPORT_RATIO, STAR_LABELS, TAG_COLORS, CAB_TYPES } from "../data/constants";
import { hotelBudget, hotelBudgetLabel, pickCab } from "../utils/budgetUtils";




export function ShortageScreen({ ctx, onIncreaseBudget, onPickHotel, onReset }) {
  const { budget, hotelBudget, days, preferred, cityHotels, wantsCab } = ctx;
  const hotelCost   = preferred.price * days;
  const shortage    = hotelCost - hotelBudget;
  const neededTotal = Math.ceil(budget + shortage);

  const sorted = [...cityHotels].sort((a, b) => a.stars - b.stars);

  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <h2 style={{ color:"#1f2937", marginBottom:8 }}>💸 Budget Shortage</h2>
        <p style={{ color:"#6b7280" }}>Your budget is a bit short for a <strong>{STAR_LABELS[preferred.stars]}</strong> hotel in {ctx.city}.</p>
      </div>

      <div style={{ background:"linear-gradient(135deg,#fef3c7,#fff7ed)", border:"2px solid #f59e0b", borderRadius:14, padding:"20px 24px", marginBottom:24 }}>
        <h4 style={{ color:"#92400e", marginBottom:12 }}>📊 Budget needed per category ({days} night{days>1?"s":""})</h4>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.9rem" }}>
            <thead>
              <tr>{["Category","Hotel","Per Night","Total","Status"].map(h => (
                <th key={h} style={{ textAlign:"left", padding:"6px 10px", color:"#6b7280", fontWeight:600, borderBottom:"1px solid #fde68a" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {sorted.map(h => {
                const cost = h.price * days;
                const ok   = cost <= hotelBudget;
                const need = ok ? 0 : Math.ceil(budget + (cost - hotelBudget));
                return (
                  <tr key={h.id}>
                    <td style={{ padding:"8px 10px", borderBottom:"1px solid #fef9c3" }}>{"⭐".repeat(h.stars)} {STAR_LABELS[h.stars]}</td>
                    <td style={{ padding:"8px 10px", borderBottom:"1px solid #fef9c3" }}>{h.name}</td>
                    <td style={{ padding:"8px 10px", borderBottom:"1px solid #fef9c3" }}>₹{h.price.toLocaleString()}/night</td>
                    <td style={{ padding:"8px 10px", borderBottom:"1px solid #fef9c3" }}>₹{cost.toLocaleString()}</td>
                    <td style={{ padding:"8px 10px", borderBottom:"1px solid #fef9c3", color: ok ? "#059669" : "#dc2626", fontWeight:700 }}>
                      {ok ? "✔ Within budget" : `Need ₹${need.toLocaleString()} total`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop:12, background:"white", borderRadius:8, padding:"12px 14px", fontSize:"0.85rem", color:"#4b5563" }}>
          💡 <strong>Your budget:</strong> ₹{budget.toLocaleString()} &nbsp;|&nbsp;
          <strong>Hotel portion ({hotelBudgetLabel(wantsCab)}):</strong> ₹{Math.round(hotelBudget).toLocaleString()}<br/>
          To stay at <strong>{STAR_LABELS[preferred.stars]}</strong> you need at least <strong>₹{neededTotal.toLocaleString()}</strong> (₹{neededTotal - budget} more).
        </div>
      </div>

      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
        {[
          ["✅ Increase Budget to ₹" + neededTotal.toLocaleString(), "#6366f1", "white", () => onIncreaseBudget(neededTotal)],
          ["🏨 Pick an Affordable Hotel", "#e5e7eb", "#374151", onPickHotel],
          ["← Change Details", "#e5e7eb", "#374151", onReset],
        ].map(([label, bg, color, fn]) => (
          <button key={label} onClick={fn} style={{ flex:1, minWidth:160, padding:16, background:bg, color, border:"none", borderRadius:10, fontSize:"1rem", fontWeight:600, cursor:"pointer" }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}


