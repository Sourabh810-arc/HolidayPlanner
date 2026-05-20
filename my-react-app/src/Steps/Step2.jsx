import React from "react";
import { useState, useCallback } from "react";

import { localDateStr, parseLocalDate, formatDate, calculateDays } from "../utils/dateUtils";
import { hotelBudgetLabel } from "../utils/budgetUtils";
import { TRANSPORT_RATIO, STAR_LABELS, TAG_COLORS } from "../data/constants";

import StarPicker from "../components/StarPicker";
import HotelImage from "../components/HotelImage";
import BudgetBar from "../components/BudgetBar";
import Toast from "../components/Toast";
import Field from "../components/Field";
import { buildItinerary } from "../utils/itineraryUtils";

export function Step2({ plan, onReset }) {
  const { pr, cityHotels, activities, touristPlaces } = plan;
  const places    = touristPlaces || [];
  const acts      = activities || [];

  const [selPlaces,    setSelPlaces]    = useState([]);
  const [selActs,      setSelActs]      = useState([]);
  const [pickupLoc,    setPickupLoc]    = useState("");
  const [dropLoc,      setDropLoc]      = useState("");
  const [pickupTime,   setPickupTime]   = useState("");
  const [toast,        setToast]        = useState("");

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const togglePlace = p => setSelPlaces(prev => prev.find(x=>x.id===p.id) ? prev.filter(x=>x.id!==p.id) : [...prev, p]);
  const toggleAct   = a => setSelActs(prev   => prev.find(x=>x.id===a.id) ? prev.filter(x=>x.id!==a.id) : [...prev, a]);

  const usedSoFar  = pr.hotelCost + (pr.cab ? pr.cab.estimatedCost : 0);
  const actBudget  = Math.max(0, pr.budget - usedSoFar);
  const actTotal   = selActs.reduce((s, a) => s + a.pricePerPerson * pr.travelers, 0);
  const cabCost    = pr.cab ? pr.cab.estimatedCost : 0;
  const totalSpent = pr.hotelCost + cabCost + actTotal;
  const remaining  = pr.budget - totalSpent;
  const itinerary  = buildItinerary(pr, selPlaces, selActs);

  const handleConfirm = () => {
    if (pr.wantsCabService) {
      if (pr.cabBookingType === "perDay") {
        if (!pickupLoc.trim() || !dropLoc.trim() || !pickupTime) { showToast("⚠️ Please fill all cab booking details"); return; }
        if (new Date(pickupTime) < new Date()) { showToast("⚠️ Pickup time must be in the future"); return; }
      } else {
        if (!pickupTime) { showToast("⚠️ Please select pickup time"); return; }
      }
    }
    plan.onConfirm({ selPlaces, selActs, pickupLoc, dropLoc, pickupTime, itinerary, totalSpent });
  };

  return (
    <div>
      <Toast msg={toast} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h2 style={{ color:"#1f2937" }}>Your Optimized Plan</h2>
        <span style={{ color:"#10b981", fontSize:"2rem" }}>✓</span>
      </div>

      {/* Over-budget alert */}
      {pr.isOverBudget && (
        <div style={{ background:"#fef3c7", borderLeft:"4px solid #f59e0b", padding:16, marginBottom:16, borderRadius:8 }}>
          <h4 style={{ color:"#92400e", marginBottom:8 }}>⚠️ Selected Hotel Exceeds Allocated Budget</h4>
          <div style={{ background:"white", padding:12, borderRadius:6, marginBottom:12 }}>
            {[
              ["Your Total Budget",       `₹${pr.budget.toLocaleString()}`],
              ["Hotel Budget Allocated",  `₹${Math.round(pr.hotelBudget).toLocaleString()}`],
              ["Selected Hotel Cost",     `₹${pr.hotelCost.toLocaleString()}`],
            ].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", fontSize:"0.9rem", borderBottom:"1px solid #f3f4f6" }}>
                <span>{k}</span><span style={{ fontWeight:600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0 8px", fontWeight:700, color:"#dc2626" }}>
              <span>Additional Needed</span>
              <span>₹{Math.round(pr.hotelCost - pr.hotelBudget).toLocaleString()}</span>
            </div>
          </div>
          <button onClick={() => plan.onShowOtherHotels()} style={{ padding:"10px 16px", background:"white", border:"2px solid #86efac", borderRadius:8, cursor:"pointer", fontSize:"0.9rem", marginRight:8 }}>
            Choose a different hotel
          </button>
        </div>
      )}

      {/* Hotel card */}
      <div style={{ background: pr.isOverBudget ? "#fff7ed" : "#dbeafe", padding:24, borderRadius:12, marginBottom:24, border: pr.isOverBudget ? "2px solid #fb923c" : "none" }}>
        <HotelImage src={pr.hotel.image} alt={pr.hotel.name} />
        <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ display:"inline-flex", background:"#fef3c7", border:"1px solid #fde68a", borderRadius:20, padding:"3px 10px", fontSize:"0.8rem", fontWeight:700, color:"#92400e", marginBottom:8 }}>
              {"⭐".repeat(pr.hotel.stars)} {STAR_LABELS[pr.hotel.stars]}
            </div>
            <h3 style={{ color:"#1f2937", marginBottom:8 }}>{pr.hotel.name}</h3>
            <p style={{ color:"#6b7280", fontSize:"0.9rem", marginBottom:8 }}>{pr.hotel.location}, {pr.city}</p>
            <span style={{ background:"#fef3c7", padding:"4px 10px", borderRadius:6, fontSize:"0.85rem" }}>⭐ {pr.hotel.rating}</span>
            <span style={{ marginLeft:10, fontSize:"0.9rem", color:"#4b5563" }}>{pr.days} night{pr.days>1?"s":""}</span>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:"0.85rem", color:"#6b7280" }}>Total Hotel Cost</div>
            <div style={{ fontSize:"2rem", fontWeight:"bold", color: pr.isOverBudget ? "#f59e0b" : "#6366f1" }}>₹{pr.hotelCost.toLocaleString()}</div>
            <div style={{ fontSize:"0.75rem", color:"#9ca3af" }}>₹{pr.hotel.price}/night</div>
          </div>
        </div>
      </div>

      {/* Cab card */}
      {pr.wantsCabService && pr.cab && (
        <div style={{ background:"#d1fae5", padding:24, borderRadius:12, marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <div style={{ width:32, height:32, background:"#10b981", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"bold" }}>🚗</div>
            <h3>{pr.cab.type} Cab {pr.cabBookingType === "fullTrip" ? "(Full Trip)" : "(Per Day)"}</h3>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:"0.9rem", color:"#374151" }}>
            <div>Capacity: {pr.cab.capacity} passengers</div>
            <div>Est. Cost: ₹{pr.cab.estimatedCost.toLocaleString()}</div>
            <div>Distance: {pr.cab.distance} km</div>
            <div>Booking: {pr.cabBookingType === "fullTrip" ? "Full trip" : "Per day/trip"}</div>
          </div>
          {pr.cab.warning && <p style={{ color:"#d97706", marginTop:12 }}>⚠️ {pr.cab.warning}</p>}
        </div>
      )}

      {/* Activities */}
      <div style={{ marginBottom:28 }}>
        <h3 style={{ color:"#1f2937", marginBottom:6 }}>⚡ Adventure &amp; Activities</h3>
        <p style={{ fontSize:"0.85rem", color:"#6b7280", marginBottom:16 }}>
          Pick experiences — activity budget from remaining funds: <strong>₹{actBudget.toLocaleString()}</strong>
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:14 }}>
          {acts.map(act => {
            const sel = !!selActs.find(a => a.id === act.id);
            const tg  = TAG_COLORS[act.tag] || TAG_COLORS.Adventure;
            const tc  = act.pricePerPerson * pr.travelers;
            return (
              <div
                key={act.id}
                role="checkbox" aria-checked={sel} tabIndex={0}
                onClick={() => toggleAct(act)}
                onKeyDown={e => (e.key==="Enter"||e.key===" ") && toggleAct(act)}
                style={{
                  border:`2px solid ${sel ? "#6366f1" : "#e5e7eb"}`, borderRadius:14,
                  overflow:"hidden", cursor:"pointer", background:"white", position:"relative",
                  boxShadow: sel ? "0 4px 16px rgba(99,102,241,0.25)" : "none",
                  transition:"all 0.2s",
                }}
              >
                {sel && (
                  <div style={{ position:"absolute", top:8, right:8, width:22, height:22, background:"#6366f1", color:"white", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", fontWeight:700 }}>✓</div>
                )}
                <div style={{ fontSize:"2.5rem", textAlign:"center", padding:"20px 10px 8px" }}>{act.emoji}</div>
                <div style={{ padding:"0 14px 16px" }}>
                  <div style={{ fontWeight:700, color:"#1f2937", fontSize:"0.95rem", marginBottom:4 }}>{act.name}</div>
                  <div style={{ display:"inline-block", padding:"2px 8px", borderRadius:20, fontSize:"0.7rem", fontWeight:700, background:tg.bg, color:tg.color, marginBottom:6 }}>{act.tag}</div>
                  <div style={{ fontSize:"0.75rem", color:"#6b7280", marginBottom:8, lineHeight:1.4 }}>{act.desc}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:"1rem", fontWeight:700, color:"#6366f1" }}>₹{act.pricePerPerson.toLocaleString()}</div>
                      <div style={{ fontSize:"0.7rem", color:"#9ca3af" }}>per person</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:"0.85rem", fontWeight:700, color:"#374151" }}>₹{tc.toLocaleString()}</div>
                      <div style={{ fontSize:"0.7rem", color:"#9ca3af" }}>for {pr.travelers}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {selActs.length > 0 && (
          <div style={{ marginTop:16 }}>
            <BudgetBar spent={actTotal} total={actBudget} label="⚡ Activity Budget Tracker" />
          </div>
        )}
      </div>

      {/* Tourist places */}
      <div style={{ marginBottom:24 }}>
        <h3 style={{ color:"#1f2937", marginBottom:16 }}>📸 Select Tourist Places to Visit</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {places.map(p => {
            const sel = !!selPlaces.find(x => x.id === p.id);
            return (
              <div
                key={p.id}
                role="checkbox" aria-checked={sel} tabIndex={0}
                onClick={() => togglePlace(p)}
                onKeyDown={e => (e.key==="Enter"||e.key===" ") && togglePlace(p)}
                style={{ border:`3px solid ${sel ? "#6366f1" : "#e5e7eb"}`, borderRadius:12, overflow:"hidden", cursor:"pointer", boxShadow: sel ? "0 4px 12px rgba(99,102,241,0.3)" : "none", transition:"all 0.2s" }}
              >
                <HotelImage src={p.image} alt={p.name} />
                <div style={{ padding:12 }}>
                  <div style={{ fontWeight:600, color:"#1f2937", fontSize:"0.9rem" }}>{p.name}</div>
                  <div style={{ fontSize:"0.75rem", color:"#6b7280" }}>{p.type}</div>
                </div>
              </div>
            );
          })}
        </div>
        {selPlaces.length > 0 && (
          <p style={{ color:"#6366f1", fontSize:"0.9rem", marginTop:12 }}>✓ {selPlaces.length} place{selPlaces.length>1?"s":""} selected</p>
        )}
      </div>

      {/* Itinerary */}
      {itinerary.length > 0 && (
        <div style={{ background:"#f0fdf4", padding:24, borderRadius:12, marginBottom:24 }}>
          <h3 style={{ color:"#1f2937", marginBottom:16 }}>📅 Your Day-by-Day Itinerary</h3>
          {itinerary.map(day => (
            <div key={day.day} style={{ background:"white", padding:16, borderRadius:10, marginBottom:12, borderLeft:"4px solid #6366f1" }}>
              <div style={{ fontWeight:600, color:"#6366f1", marginBottom:8, fontSize:"1.1rem" }}>Day {day.day} – {day.date}</div>
              <div style={{ color:"#4b5563", fontSize:"0.9rem", lineHeight:1.6 }}>
                {day.activities.map((a, i) => <div key={i}>{i+1}. {a}</div>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Budget breakdown */}
      <div style={{ background:"#f9fafb", padding:24, borderRadius:12, marginBottom:24 }}>
        <h3 style={{ marginBottom:16, color:"#1f2937" }}>Budget Breakdown</h3>
        {[
          ["Total Budget",                                    `₹${pr.budget.toLocaleString()}`,     "#374151", true],
          [`Hotel (${hotelBudgetLabel(pr.wantsCabService)})`, `₹${pr.hotelCost.toLocaleString()}`,  "#374151", false],
          pr.wantsCabService ? [`Transport (${TRANSPORT_RATIO*100}%)`, `₹${Math.round(pr.breakdown.transportBudget).toLocaleString()}`, "#374151", false] : null,
          selActs.length > 0 ? [`Activities (${selActs.length}×${pr.travelers}p)`, `₹${actTotal.toLocaleString()}`, "#7c3aed", false] : null,
        ].filter(Boolean).map(([k,v,c,bold]) => (
          <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", fontSize:"0.9rem", borderBottom:"1px solid #f3f4f6" }}>
            <span style={{ color:"#6b7280" }}>{k}</span>
            <span style={{ fontWeight: bold ? 600 : 400, color:c }}>{v}</span>
          </div>
        ))}
        <div style={{ display:"flex", justifyContent:"space-between", padding:"16px 0 10px", fontWeight:"bold", borderTop:"2px solid #e5e7eb", marginTop:8 }}>
          <span style={{ color:"#6b7280" }}>Total Spent</span>
          <span style={{ color:"#6366f1" }}>₹{Math.round(totalSpent).toLocaleString()}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.9rem" }}>
          <span style={{ color:"#6b7280" }}>Remaining</span>
          <span style={{ fontWeight:600, color: remaining >= 0 ? "#10b981" : "#ef4444" }}>₹{Math.round(remaining).toLocaleString()}</span>
        </div>
      </div>

      {/* Cab details form */}
      {pr.wantsCabService && (
        <div style={{ marginBottom:24 }}>
          <h3 style={{ marginBottom:16, color:"#1f2937" }}>🚖 Cab Booking Details</h3>
          {pr.cabBookingType === "perDay" ? (
            <>
              <Field label="Pickup Location">
                <input value={pickupLoc} onChange={e=>setPickupLoc(e.target.value)} placeholder="e.g., Airport, Hotel" maxLength={200} className="input-field" />
              </Field>
              <Field label="Drop Location">
                <input value={dropLoc} onChange={e=>setDropLoc(e.target.value)} placeholder="e.g., Hotel, Tourist spot" maxLength={200} className="input-field" />
              </Field>
              <Field label="Pickup Date & Time">
                <input type="datetime-local" value={pickupTime} onChange={e=>setPickupTime(e.target.value)} min={`${pr.checkIn}T00:00`} max={`${pr.checkOut}T23:59`} className="input-field" />
              </Field>
            </>
          ) : (
            <>
              <p style={{ background:"#e0e7ff", padding:12, borderRadius:8, marginBottom:12, color:"#4338ca" }}>
                ℹ️ Your cab will be available for the entire trip duration.
              </p>
              <Field label="Pickup Time on Check-in Day">
                <input type="time" value={pickupTime} onChange={e=>setPickupTime(e.target.value)} className="input-field" />
              </Field>
            </>
          )}
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:24 }}>
        <button onClick={onReset} className="button button-secondary" style={{ width: "100%", padding: 16 }}>
          Plan New Trip
        </button>
        <button onClick={handleConfirm} className="button button-primary" style={{ width: "100%", padding: 16 }}>
          Confirm Booking
        </button>
      </div>
    </div>
  );
}