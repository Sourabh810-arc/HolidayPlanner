import { useEffect, useState } from "react";
import { formatDate } from "../utils/dateUtils";

export function PastTrips({ token, onNewTrip, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:5000/api/bookings/user/my-bookings", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Unable to fetch trips");
        setBookings(result.data || []);
      } catch (err) {
        setError(err.message || "Unable to load past trips.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTrips();
  }, [token]);

  return (
    <div style={{ padding: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ color: "#1f2937", marginBottom: 8 }}>📚 Past Trips</h2>
          <p style={{ color: "#4b5563", margin: 0 }}>All of your confirmed holiday plans are listed here.</p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={onLogout} className="button button-secondary">
            Logout
          </button>
          <button onClick={onNewTrip} className="button button-primary">
            Plan New Trip
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 24, borderRadius: 20, background: "#f8fafc", textAlign: "center", color: "#374151" }}>
          Loading your trips...
        </div>
      ) : error ? (
        <div style={{ padding: 24, borderRadius: 20, background: "#fee2e2", color: "#991b1b" }}>{error}</div>
      ) : bookings.length === 0 ? (
        <div style={{ padding: 24, borderRadius: 20, background: "#eff6ff", color: "#1e40af" }}>
          No past trips found yet. Complete a booking to see it here.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 18 }}>
          {bookings.map((booking) => (
            <div key={booking._id || booking.id} style={{ background: "white", borderRadius: 20, padding: 24, boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, color: "#111827" }}>{booking.hotelName || booking.city}</h3>
                  <p style={{ margin: "6px 0", color: "#4b5563" }}>{booking.city} • {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}</p>
                </div>
                <div style={{ textAlign: "right", color: "#374151" }}>
                  <div style={{ fontSize: "0.95rem" }}>{formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}</div>
                  <div style={{ fontWeight: 700, color: "#6366f1", marginTop: 6 }}>₹{(booking.totalSpent || 0).toLocaleString()}</div>
                </div>
              </div>
              {booking.itinerary?.length > 0 && (
                <div style={{ display: "grid", gap: 10 }}>
                  {booking.itinerary.map((day) => (
                    <div key={day.day} style={{ padding: 14, borderRadius: 14, background: "#f8fafc" }}>
                      <div style={{ fontWeight: 700, color: "#1f2937", marginBottom: 6 }}>Day {day.day} • {day.date}</div>
                      {day.activities?.map((activity, idx) => (
                        <div key={idx} style={{ color: "#4b5563", fontSize: "0.95rem", lineHeight: 1.6 }}>• {activity}</div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
