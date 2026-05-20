import React from "react";
import { useState, useCallback } from "react";

import { localDateStr, parseLocalDate, formatDate, calculateDays } from "../utils/dateUtils";

import StarPicker from "../components/StarPicker";

import Field from "../components/Field";
export function Step1({ onSubmit }) {
  const today = localDateStr(new Date());
  const [form, setForm] = useState({
    budget:"", city:"", checkIn:"", checkOut:"", travelers:"1",
    wantsCab:true, cabType:"perDay", stars:4,
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.budget || parseFloat(form.budget) < 1000) e.budget = "Minimum ₹1000";
    if (!form.city) e.city = "Select a city";
    if (!form.checkIn || form.checkIn < today) e.checkIn = "Select a valid check-in date";
    if (!form.checkOut || form.checkOut <= form.checkIn) e.checkOut = "Check-out must be after check-in";
    const t = parseInt(form.travelers);
    if (!t || t < 1 || t > 10) e.travelers = "Enter 1–10 travelers";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit({ ...form, budget: parseFloat(form.budget), travelers: parseInt(form.travelers) });
  };

  const inp = (extra = {}) => ({
    className: "input-field",
    onFocus: e => (e.target.style.borderColor = "#6366f1"),
    onBlur:  e => (e.target.style.borderColor = errors[extra.id] ? "#ef4444" : "#e5e7eb"),
    ...extra,
  });

  const minCheckOut = form.checkIn ? localDateStr((() => { const d = parseLocalDate(form.checkIn); d.setDate(d.getDate()+1); return d; })()) : today;

  return (
    <div>
      <h2 style={{ marginBottom:24, color:"#1f2937" }}>Plan Your Holiday</h2>

      <Field label="💰 Total Budget (₹)" error={errors.budget}>
        <input {...inp({ id:"budget", type:"number", placeholder:"Enter your total budget", min:1000, value:form.budget, onChange:e=>set("budget",e.target.value) })} />
      </Field>

      <Field label="📍 Destination City" error={errors.city}>
        <select {...inp({ id:"city", value:form.city, onChange:e=>set("city",e.target.value) })}>
          <option value="">Select a city</option>
          {["Mumbai","Delhi","Bangalore","Goa"].map(c => <option key={c}>{c}</option>)}
        </select>
      </Field>

      <div className="form-grid form-row-2">
        <Field label="📅 Check-in Date" error={errors.checkIn}>
          <input {...inp({ id:"checkIn", type:"date", min:today, value:form.checkIn, onChange:e=>set("checkIn",e.target.value) })} />
        </Field>
        <Field label="📅 Check-out Date" error={errors.checkOut}>
          <input {...inp({ id:"checkOut", type:"date", min:minCheckOut, value:form.checkOut, onChange:e=>set("checkOut",e.target.value) })} />
        </Field>
      </div>

      <Field label="👥 Number of Travelers" error={errors.travelers}>
        <input {...inp({ id:"travelers", type:"number", min:1, max:10, value:form.travelers, onChange:e=>set("travelers",e.target.value) })} />
      </Field>

      <Field label="🏨 Preferred Hotel Category">
        <StarPicker value={form.stars} onChange={v => set("stars", v)} />
      </Field>

      <div style={{ marginBottom:25 }}>
        <label style={{ display:"flex", alignItems:"center", gap:12, background:"#dbeafe", padding:16, borderRadius:10, cursor:"pointer" }}>
          <input type="checkbox" checked={form.wantsCab} onChange={e=>set("wantsCab",e.target.checked)} style={{ width:20, height:20 }} />
          <div>
            <div style={{ fontWeight:600, color:"#374151" }}>I want cab service</div>
            <div style={{ fontSize:"0.85rem", color:"#4b5563" }}>Include transportation in your budget</div>
          </div>
        </label>
        {form.wantsCab && (
          <div style={{ marginLeft:32, marginTop:8 }}>
            {[["perDay","Book cab per day/trip"],["fullTrip","Book cab for entire trip"]].map(([val,lbl]) => (
              <label key={val} style={{ display:"flex", alignItems:"center", gap:12, background:"#f3f4f6", padding:"12px 16px", borderRadius:10, marginBottom:8, cursor:"pointer" }}>
                <input type="radio" name="cabType" value={val} checked={form.cabType===val} onChange={()=>set("cabType",val)} style={{ width:18, height:18 }} />
                <span style={{ color:"#374151", fontWeight:500 }}>{lbl}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="button button-primary"
        style={{ width: "100%" }}
      >
        Generate Smart Plan
      </button>
    </div>
  );
}
