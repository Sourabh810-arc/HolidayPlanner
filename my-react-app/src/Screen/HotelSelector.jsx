import { HOTELS } from "../data/hotels";
import { STAR_LABELS } from "../data/constants";
import { hotelBudgetLabel } from "../utils/budgetUtils";





export function HotelSelector({ ctx, onSelect, onReset }) {
  const { budget, hotelBudget, days, cityHotels, wantsCab, city } = ctx;
  const hotelsForCity = (cityHotels && cityHotels.length) ? cityHotels : (HOTELS[city] || []);
  const sorted = [...hotelsForCity].sort((a, b) => a.price - b.price);

  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <h2 style={{ color:"#1f2937", marginBottom:8 }}>🏨 Choose Your Hotel</h2>
        <p style={{ color:"#6b7280" }}>Select any hotel — we'll show you the exact costs.</p>
      </div>
      <div style={{ background:"#fef3c7", borderLeft:"4px solid #f59e0b", padding:16, marginBottom:16, borderRadius:8 }}>
        <h4 style={{ color:"#92400e", marginBottom:8 }}>📊 Your Budget at a Glance</h4>
        <div style={{ background:"white", padding:12, borderRadius:6 }}>
          {[["Total Budget", `₹${budget.toLocaleString()}`], [`Hotel Budget (${hotelBudgetLabel(wantsCab)})`, `₹${Math.round(hotelBudget).toLocaleString()}`], ["Trip Duration", `${days} night${days>1?"s":""}`]].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", fontSize:"0.9rem", borderBottom:"1px solid #f3f4f6" }}>
              <span>{k}</span><span style={{ fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:"#f9fafb", padding:20, borderRadius:12, marginBottom:24 }}>
        {sorted.length === 0 ? (
          <div style={{ padding:20, borderRadius:10, background:"white", color:"#374151", textAlign:"center", fontSize:"1rem" }}>
            No hotels found for the selected city. Please change the city or try again.
          </div>
        ) : sorted.map((hotel, idx) => {
          const totalCost    = hotel.price * days;
          const affordable   = totalCost <= hotelBudget;
          const extraNeeded  = affordable ? 0 : Math.ceil(budget + (totalCost - hotelBudget));
          return (
            <div
              key={hotel.id || hotel._id || idx}
              onClick={() => onSelect(hotel)}
              style={{
                background: idx === 0 ? "#f0fdf4" : "white", padding:16, margin:"12px 0",
                borderRadius:10, border:`2px solid ${idx === 0 ? "#10b981" : "#e5e7eb"}`,
                cursor:"pointer", transition:"all 0.2s",
              }}
            >
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8, marginBottom:8 }}>
                <div>
                  <strong style={{ fontSize:"1.1rem", color:"#1f2937" }}>{hotel.name}</strong>
                  <span style={{ marginLeft:8, background:"#fef3c7", border:"1px solid #fde68a", borderRadius:20, padding:"3px 10px", fontSize:"0.8rem", fontWeight:700, color:"#92400e" }}>
                    {"⭐".repeat(hotel.stars)} {STAR_LABELS[hotel.stars]}
                  </span>
                  {idx === 0 && <span style={{ marginLeft:6, background:"#d1fae5", color:"#065f46", padding:"4px 8px", borderRadius:4, fontSize:"0.75rem", fontWeight:600 }}>CHEAPEST</span>}
                  {affordable
                    ? <span style={{ marginLeft:6, background:"#fef3c7", color:"#92400e", padding:"4px 8px", borderRadius:4, fontSize:"0.75rem", fontWeight:600 }}>WITHIN BUDGET</span>
                    : <span style={{ marginLeft:6, background:"#fee2e2", color:"#991b1b", padding:"4px 8px", borderRadius:4, fontSize:"0.75rem", fontWeight:600 }}>OVER BUDGET</span>
                  }
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:"1.5rem", fontWeight:"bold", color: affordable ? "#10b981" : "#f59e0b" }}>₹{totalCost.toLocaleString()}</div>
                  <div style={{ fontSize:"0.8rem", color:"#6b7280" }}>₹{hotel.price}/night</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:"0.9rem", color:"#4b5563" }}>
                <div>📍 {hotel.location}</div><div>⭐ {hotel.rating} Rating</div>
              </div>
              {!affordable && (
                <div style={{ background:"#fef3c7", padding:"10px 12px", borderRadius:6, marginTop:10, fontSize:"0.85rem" }}>
                  💸 You need a total budget of <strong style={{ color:"#d97706" }}>₹{extraNeeded.toLocaleString()}</strong> to book this hotel.
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button onClick={onReset} style={{ width:"100%", padding:16, background:"#e5e7eb", color:"#374151", border:"none", borderRadius:10, fontSize:"1.1rem", fontWeight:600, cursor:"pointer" }}>
        ← Change Details
      </button>
    </div>
  );
}
