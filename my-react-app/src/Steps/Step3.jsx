import React from "react";
import { useState, useCallback } from "react";

import { localDateStr, parseLocalDate, formatDate, calculateDays } from "../utils/dateUtils";
import Section from "../components/Section";
import Detail from "../components/Detail";

export function Step3({ pr, booking, onReset }) {
  const { selActs, selPlaces, pickupLoc, dropLoc, pickupTime, itinerary, totalSpent } = booking;
  const cabCost  = pr.wantsCabService && pr.cab ? pr.cab.estimatedCost : 0;
  const actTotal = selActs.reduce((s, a) => s + a.pricePerPerson * pr.travelers, 0);

  return (
    <div style={{ textAlign:"center", padding:"40px 20px" }}>
      <div style={{ width:80, height:80, background:"#10b981", borderRadius:"50%", margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:"3rem" }}>✓</div>
      <h2 style={{ color:"#1f2937", fontSize:"2rem", marginBottom:12 }}>Booking Confirmed!</h2>
      <p style={{ color:"#6b7280", marginBottom:24 }}>Your holiday package has been successfully booked</p>

      <div style={{ background:"linear-gradient(135deg,#dbeafe,#e0e7ff)", borderRadius:12, padding:24, marginBottom:24, textAlign:"left" }}>
        <h3 style={{ textAlign:"center", marginBottom:20, color:"#1f2937" }}>Booking Summary</h3>

        <Section title="🏨 Hotel Booking">
          <Detail><strong>{pr.hotel.name}</strong> {"⭐".repeat(pr.hotel.stars)}</Detail>
          <Detail>{pr.hotel.location}, {pr.city}</Detail>
          <Detail>Check-in: {formatDate(pr.checkIn)} | Check-out: {formatDate(pr.checkOut)}</Detail>
          <Detail>Guests: {pr.travelers} | Nights: {pr.days}</Detail>
          <Detail style={{ color:"#6366f1", fontWeight:600 }}>Cost: ₹{pr.hotelCost.toLocaleString()}</Detail>
        </Section>

        {pr.wantsCabService && pr.cab && (
          <Section title={`🚗 Cab Booking ${pr.cabBookingType === "fullTrip" ? "(Full Trip)" : "(Per Day)"}`}>
            <Detail><strong>{pr.cab.type} Cab</strong></Detail>
            {pr.cabBookingType === "fullTrip" ? (
              <>
                <Detail>Duration: Entire trip ({pr.days} days)</Detail>
                <Detail>Pickup: {formatDate(pr.checkIn)} at {pickupTime}</Detail>
                <Detail>Location: {pr.hotel.name}</Detail>
              </>
            ) : (
              <>
                <Detail>From: {pickupLoc}</Detail>
                <Detail>To: {dropLoc}</Detail>
                <Detail>Pickup: {isNaN(Date.parse(pickupTime)) ? pickupTime : new Date(pickupTime).toLocaleString()}</Detail>
              </>
            )}
            <Detail style={{ color:"#10b981", fontWeight:600 }}>Est. Cost: ₹{pr.cab.estimatedCost.toLocaleString()}</Detail>
          </Section>
        )}

        {selActs.length > 0 && (
          <Section title="⚡ Adventure Activities">
            {selActs.map(a => (
              <Detail key={a.id}>{a.emoji} <strong>{a.name}</strong> — ₹{(a.pricePerPerson * pr.travelers).toLocaleString()}</Detail>
            ))}
            <Detail style={{ color:"#7c3aed", fontWeight:600, marginTop:6 }}>Total: ₹{actTotal.toLocaleString()}</Detail>
          </Section>
        )}

        {itinerary.length > 0 && (
          <Section title="📅 Itinerary">
            {itinerary.map(day => (
              <div key={day.day} style={{ marginBottom:8 }}>
                <Detail><strong>Day {day.day} ({day.date})</strong></Detail>
                {day.activities.map((a, i) => <Detail key={i} style={{ marginLeft:16 }}>• {a}</Detail>)}
              </div>
            ))}
          </Section>
        )}

        <div style={{ borderTop:"2px solid #e5e7eb", paddingTop:16, marginTop:16, textAlign:"center" }}>
          <div style={{ color:"#6b7280", fontSize:"0.9rem" }}>Total Booking Amount</div>
          <div style={{ fontSize:"2rem", fontWeight:"bold", color:"#6366f1" }}>₹{totalSpent.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ background:"#fef3c7", border:"1px solid #fde047", padding:16, borderRadius:10, marginBottom:24, fontSize:"0.9rem", color:"#4b5563" }}>
        📧 A confirmation email has been sent with your booking details and itinerary.
      </div>

      <button onClick={onReset} style={{ padding:"16px 32px", background:"#6366f1", color:"white", border:"none", borderRadius:10, fontSize:"1.1rem", fontWeight:600, cursor:"pointer" }}>
        Plan Another Trip
      </button>
    </div>
  );
}
