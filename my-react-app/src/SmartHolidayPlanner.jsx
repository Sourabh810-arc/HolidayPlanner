import { useState, useCallback, useEffect } from "react";
import { HOTELS } from "./data/hotels";
import { ACTIVITIES } from "./data/activities";
import { TOURIST_PLACES } from "./data/touristPlaces";

import { HOTEL_RATIO_CAB, HOTEL_RATIO_NO_CAB, TRANSPORT_RATIO, STAR_LABELS, TAG_COLORS, CAB_TYPES } from "./data/constants";
import { localDateStr, parseLocalDate, formatDate, calculateDays } from "./utils/dateUtils";
import { hotelBudget, hotelBudgetLabel, pickCab } from "./utils/budgetUtils";

import {Step1 } from "./Steps/Step1";
import { Step2 } from "./Steps/Step2";
import { ShortageScreen } from "./Screen/ShortageScreen";
import { HotelSelector } from "./Screen/HotelSelector";
import { LoginScreen } from "./Screen/LoginScreen";
import { PastTrips } from "./Screen/PastTrips";
import Toast from "./components/Toast";
import { sendBookingConfirmationEmail } from "./utils/emailApi";


export default function SmartHolidayPlanner() {
  const [screen, setScreen] = useState("form"); // form | shortage | hotelSelect | plan | confirm
  const [planResult, setPlanResult] = useState(null);
  const [shortageCtx, setShortageCtx] = useState(null);
  const [hotelSelectCtx, setHotelSelectCtx] = useState(null);
  const [booking, setBooking] = useState(null);
  const [prefillForm, setPrefillForm] = useState(null);
  const [hotels, setHotels] = useState({});
  const [activities, setActivities] = useState({});
  const [touristPlaces, setTouristPlaces] = useState({});
  const [authToken, setAuthToken] = useState(localStorage.getItem('tripAuthToken') || '');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('tripAuthToken');
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch('https://holiday-planner-gray.vercel.app/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok && result.success) {
          setUser(result.user);
          setAuthToken(token);
        } else {
          localStorage.removeItem('tripAuthToken');
        }
      } catch (error) {
        localStorage.removeItem('tripAuthToken');
      } finally {
        setAuthLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        const [hotelsRes, activitiesRes, placesRes] = await Promise.all([
          fetch('https://holiday-planner-gray.vercel.app/api/hotels'),
          fetch('https://holiday-planner-gray.vercel.app/api/activities'),
          fetch('https://holiday-planner-gray.vercel.app/api/tourist-places')
        ]);
        const hotelsData = await hotelsRes.json();
        const activitiesData = await activitiesRes.json();
        const placesData = await placesRes.json();

        const hotelsSource = Array.isArray(hotelsData?.data) && hotelsData.data.length ? hotelsData.data : Object.values(HOTELS).flat();
        const activitiesSource = Array.isArray(activitiesData?.data) && activitiesData.data.length ? activitiesData.data : Object.values(ACTIVITIES).flat();
        const placesSource = Array.isArray(placesData?.data) && placesData.data.length ? placesData.data : Object.values(TOURIST_PLACES).flat();

        const hotelsByCity = hotelsSource.reduce((acc, hotel) => {
          if (!acc[hotel.city]) acc[hotel.city] = [];
          acc[hotel.city].push({ ...hotel, id: hotel._id || hotel.id });
          return acc;
        }, {});

        const activitiesByCity = activitiesSource.reduce((acc, activity) => {
          if (!acc[activity.city]) acc[activity.city] = [];
          acc[activity.city].push({ ...activity, id: activity._id || activity.id });
          return acc;
        }, {});

        const placesByCity = placesSource.reduce((acc, place) => {
          if (!acc[place.city]) acc[place.city] = [];
          acc[place.city].push({ ...place, id: place._id || place.id });
          return acc;
        }, {});

        setHotels(hotelsByCity);
        setActivities(activitiesByCity);
        setTouristPlaces(placesByCity);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to static data
        setHotels(HOTELS);
        setActivities(ACTIVITIES);
        setTouristPlaces(TOURIST_PLACES);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    fetchData();
  }, []);

  const reset = useCallback(() => {
    setScreen("form");
    setPlanResult(null);
    setShortageCtx(null);
    setHotelSelectCtx(null);
    setBooking(null);
    setPrefillForm(null);
  }, []);

  const buildPlan = useCallback((form, overrideHotel = null) => {
    const { budget, city, checkIn, checkOut, travelers, wantsCab, cabType, stars } = form;
    const days        = calculateDays(checkIn, checkOut);
    const hBudget     = hotelBudget(budget, wantsCab);
    const tBudget     = wantsCab ? budget * TRANSPORT_RATIO : 0;
    const cityHotels  = hotels[city] || [];
    const hotel       = overrideHotel || cityHotels.find(h => h.stars === stars) || null;

    if (!hotel) {
      // No match for selected stars — show hotel selector
      setHotelSelectCtx({ budget, hotelBudget: hBudget, days, cityHotels, wantsCab, cabType, travelers, city, checkIn, checkOut, form });
      setScreen("hotelSelect");
      return;
    }

    const hotelCost   = hotel.price * days;
    const isOverBudget = hotelCost > hBudget;

    if (!overrideHotel && isOverBudget) {
      setShortageCtx({ budget, hotelBudget: hBudget, days, preferred: hotel, cityHotels, wantsCab, cabType, travelers, city, checkIn, checkOut, form });
      setScreen("shortage");
      return;
    }

    const cab = wantsCab ? pickCab(budget, hotelCost, days, cabType, travelers) : null;

    setPlanResult({
      hotel, hotelCost, cab, days, wantsCabService: wantsCab, cabBookingType: cabType,
      city, checkIn, checkOut, travelers, budget, isOverBudget,
      hotelBudget: hBudget, allHotels: cityHotels, stars: hotel.stars,
      breakdown: { hotelBudget: hBudget, transportBudget: tBudget },
      activities: activities[city] || [],
      touristPlaces: touristPlaces[city] || [],
    });
    setScreen("plan");
  }, [hotels, activities, touristPlaces]);

  const handleFormSubmit = useCallback((form) => {
    buildPlan(form);
  }, [buildPlan]);

  const handleAuthenticated = useCallback(({ token, user }) => {
    localStorage.setItem('tripAuthToken', token);
    setAuthToken(token);
    setUser(user);
    setAuthError('');
    setScreen('form');
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('tripAuthToken');
    setAuthToken('');
    setUser(null);
    setScreen('auth');
  }, []);

  const showNotification = useCallback((msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 5000);
  }, []);

  const handleIncreaseBudget = useCallback((newBudget) => {
    const ctx = shortageCtx;
    setPrefillForm({ ...ctx.form, budget: String(newBudget) });
    reset();
    setScreen("form");
    // Use setTimeout so the form re-mounts before we set prefill
    setTimeout(() => setPrefillForm({ ...ctx.form, budget: String(newBudget) }), 0);
  }, [shortageCtx, reset]);

  const handleSelectHotel = useCallback((hotel) => {
    const ctx = hotelSelectCtx || shortageCtx;
    buildPlan(ctx.form, hotel);
  }, [hotelSelectCtx, shortageCtx, buildPlan]);

  const handleShowOtherHotels = useCallback(() => {
    const pr = planResult;
    setHotelSelectCtx({ budget: pr.budget, hotelBudget: pr.hotelBudget, days: pr.days, cityHotels: pr.allHotels, wantsCab: pr.wantsCabService, cabType: pr.cabBookingType, travelers: pr.travelers, city: pr.city, checkIn: pr.checkIn, checkOut: pr.checkOut, form: {} });
    setScreen("hotelSelect");
  }, [planResult]);

  const css = `
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; background:linear-gradient(135deg,#dbeafe,#eff6ff); min-height:100vh; }
    button { font: inherit; }
    .planner-shell { max-width:960px; margin: 0 auto; padding: 28px 16px 56px; }
    .planner-shell header { text-align: center; margin-bottom: 28px; }
    .hero-bar { background: linear-gradient(135deg,#6366f1,#818cf8); color: white; border-radius: 24px; padding: 32px; box-shadow: 0 24px 60px rgba(99,102,241,0.18); position: relative; overflow: hidden; }
    .hero-bar::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top left, rgba(255,255,255,0.22), transparent 25%), radial-gradient(circle at bottom right, rgba(255,255,255,0.12), transparent 18%); pointer-events: none; }
    .hero-bar > * { position: relative; }
    .hero-title { font-size: clamp(2rem, 4vw, 3rem); line-height: 1.05; margin-bottom: 14px; }
    .hero-copy { color: rgba(255,255,255,0.9); font-size: 1rem; margin-bottom: 22px; max-width: 720px; margin-left: auto; margin-right: auto; }
    .hero-pill { display: inline-flex; align-items: center; gap: 0.65rem; padding: 12px 18px; border-radius: 999px; background: rgba(255,255,255,0.18); color: #eef2ff; font-weight:700; letter-spacing:0.01em; margin-bottom: 18px; }
    .planner-card { background: white; border-radius: 28px; padding: 34px; box-shadow: 0 24px 50px rgba(15,23,42,0.08); border: 1px solid rgba(15,23,42,0.06); }
    .user-panel { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap:wrap; margin-bottom:24px; padding:24px; border-radius:22px; background:#f8fbff; border:1px solid #e5e7eb; }
    .user-panel h2 { margin:0; font-size:1.35rem; }
    .user-actions { display:flex; flex-wrap:wrap; gap:12px; }
    .button { border:none; border-radius:16px; cursor:pointer; font-weight:700; padding:14px 20px; transition: transform 0.16s ease, box-shadow 0.16s ease; }
    .button:hover { transform: translateY(-1px); }
    .button-primary { background:#6366f1; color:white; box-shadow: 0 14px 30px rgba(99,102,241,0.18); }
    .button-secondary { background:white; color:#1f2937; border:1px solid #d1d5db; }
    .button-success { background:#10b981; color:white; }
    .button-danger { background:#ef4444; color:white; }
    .feature-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; margin-top:32px; }
    .feature-card { background:white; border-radius:20px; padding:24px; box-shadow: 0 16px 36px rgba(15,23,42,0.06); border:1px solid rgba(15,23,42,0.05); }
    .feature-card strong { color:#111827; }
    .section-title { margin:0 0 12px; color:#111827; font-size:1.25rem; }
    .subtext { color:#4b5563; line-height:1.7; }
    .input-field { width:100%; padding:14px 16px; border-radius:14px; border:1px solid #e5e7eb; background:white; font-size:1rem; transition:border-color 0.2s ease, box-shadow 0.2s ease; }
    .input-field:focus { outline:none; border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,0.12); }
    .form-grid { display:grid; gap:20px; }
    .form-row-2 { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .info-banner { padding:18px 20px; border-radius:18px; background:#eef2ff; border:1px solid #dbeafe; margin-bottom:24px; color:#1f2937; }
    .card-surface { background:white; border-radius:20px; box-shadow:0 16px 30px rgba(15,23,42,0.08); border:1px solid rgba(15,23,42,0.06); }
    @media (max-width: 820px) { .feature-grid, .form-row-2 { grid-template-columns:1fr; } }
  `;

  return (
    <>
      <style>{css}</style>
      <Toast msg={notification} />
      <div className="planner-shell">
        <header className="hero-bar">
          <div className="hero-pill">Budget-aware travel planning</div>
          <h1 className="hero-title">🌴 Smart Holiday Planner</h1>
          <p className="hero-copy">Create a complete trip plan with hotels, activities, and cab options in a single intelligent workflow.</p>
        </header>

        <main className="planner-card">
          {authLoading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "20px" }}>⏳</div>
              <p>Verifying login session...</p>
            </div>
          ) : !user ? (
            <LoginScreen onAuthenticated={handleAuthenticated} />
          ) : loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "20px" }}>⏳</div>
              <p>Loading travel data...</p>
            </div>
          ) : (
            <>
              <div className="user-panel">
                <div>
                  <div style={{ fontSize: "0.95rem", color: "#6b7280", marginBottom: 6 }}>Logged in as</div>
                  <h2>{user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email}</h2>
                  <div style={{ color: "#4b5563", marginTop: 6 }}>{user.email}</div>
                </div>
                <div className="user-actions">
                  <button onClick={() => setScreen('pastTrips')} className="button button-secondary">
                    My Past Trips
                  </button>
                  <button onClick={handleLogout} className="button button-danger">
                    Logout
                  </button>
                </div>
              </div>

              {screen === "form" && <Step1 key={prefillForm ? JSON.stringify(prefillForm) : "default"} onSubmit={handleFormSubmit} initialValues={prefillForm} />}
              {screen === "shortage" && shortageCtx && (
                <ShortageScreen
                  ctx={shortageCtx}
                  onIncreaseBudget={handleIncreaseBudget}
                  onPickHotel={() => { setHotelSelectCtx(shortageCtx); setScreen("hotelSelect"); }}
                  onReset={reset}
                />
              )}
              {screen === "hotelSelect" && hotelSelectCtx && (
                <HotelSelector ctx={hotelSelectCtx} onSelect={handleSelectHotel} onReset={reset} />
              )}
              {screen === "plan" && planResult && (
                <Step2
                  plan={{
                    pr: planResult,
                    cityHotels: planResult.allHotels,
                    activities: planResult.activities,
                    touristPlaces: planResult.touristPlaces,
                    onConfirm: async (b) => {
                      try {
                        const response = await fetch('https://holiday-planner-gray.vercel.app/api/bookings', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
                          },
                          body: JSON.stringify({
                            userId: user?.id || null,
                            guestEmail: user?.email || 'guest@holidayplanner.com',
                            guestName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Guest User',
                            guestPhone: user?.phone || '',
                            hotelId: planResult.hotel._id || null,
                            hotelName: planResult.hotel.name,
                            hotelPrice: planResult.hotel.price,
                            city: planResult.city,
                            activities: b.selActs.map(a => ({
                              activityId: a._id || a.id,
                              activityName: a.name,
                              pricePerPerson: a.pricePerPerson || a.price,
                              totalParticipants: planResult.travelers,
                              totalCost: (a.pricePerPerson || a.price) * planResult.travelers,
                            })),
                            touristPlaces: b.selPlaces.map(p => ({
                              placeId: p._id || p.id,
                              placeName: p.name,
                            })),
                            checkIn: planResult.checkIn,
                            checkOut: planResult.checkOut,
                            travelers: planResult.travelers,
                            totalBudget: planResult.budget,
                            totalSpent: b.totalSpent,
                            cabDetails: planResult.cab ? {
                              type: planResult.cab.type,
                              bookingType: planResult.cabBookingType,
                              estimatedCost: planResult.cab.estimatedCost,
                              pickupTime: b.pickupTime,
                              pickupLocation: b.pickupLoc,
                              dropLocation: b.dropLoc,
                            } : null,
                            itinerary: b.itinerary,
                          }),
                        });
                        if (response.ok) {
                          console.log('Booking saved');
                          showNotification('Your trip is created. Booking confirmation has been sent to your registered mail id.');
                          try {
                            await sendBookingConfirmationEmail({
                              email: user?.email || 'guest@holidayplanner.com',
                              subject: `Your Holiday Booking Confirmation for ${planResult.city}`,
                              message: `Hello ${user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Guest'},\n\nYour booking for ${planResult.hotel.name} in ${planResult.city} from ${planResult.checkIn} to ${planResult.checkOut} has been confirmed. Total spent: ₹${b.totalSpent}.\n\nThank you for using Holiday Planner!`,
                            });
                            console.log('Confirmation email sent');
                          } catch (emailError) {
                            console.warn('Email confirmation failed:', emailError);
                          }
                        } else {
                          console.warn('Booking save failed', response.status);
                        }
                      } catch (error) {
                        console.error('Error saving booking:', error);
                      }
                      setBooking(b);
                      setScreen("pastTrips");
                    },
                    onShowOtherHotels: handleShowOtherHotels,
                  }}
                  onReset={reset}
                />
              )}
              {screen === "pastTrips" && (
                <PastTrips token={authToken} onNewTrip={() => setScreen('form')} onLogout={handleLogout} />
              )}
            </>
          )}
        </main>

        <section className="feature-grid">
          {[ ["Auto-Optimization","Budget allocated intelligently"], ["Best Prices","Cheapest options selected"], ["One-Click Plan","No manual comparisons"] ].map(([t,d]) => (
            <div key={t} className="feature-card">
              <div style={{ color: "#6366f1", fontWeight: 600, marginBottom: 8 }}>{t}</div>
              <div className="subtext">{d}</div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
