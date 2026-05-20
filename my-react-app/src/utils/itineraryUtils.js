// Itinerary builder helper
import { parseLocalDate } from './dateUtils';

export function buildItinerary(planResult, selectedPlaces, selectedActivities) {
  const items = [
    ...selectedPlaces.map(p    => `Visit ${p.name} (${p.type})`),
    ...selectedActivities.map(a => `${a.emoji} ${a.name} adventure`),
  ];
  if (!items.length) return [];

  const { days, checkIn, hotel, wantsCabService, cabBookingType } = planResult;
  const start      = parseLocalDate(checkIn);
  const perDay     = Math.ceil(items.length / days);
  const itinerary  = [];

  for (let i = 0; i < days; i++) {
    const d    = new Date(start);
    d.setDate(start.getDate() + i);
    const acts = [];
    if (i === 0) {
      acts.push(`Check-in at ${hotel.name}`);
      if (wantsCabService && cabBookingType === "fullTrip") acts.push("Pick up rental cab");
    }
    items.slice(i * perDay, (i + 1) * perDay).forEach(x => acts.push(x));
    if (i === days - 1) {
      acts.push("Check-out from hotel");
      if (wantsCabService && cabBookingType === "fullTrip") acts.push("Return rental cab");
    }
    itinerary.push({
      day: i + 1,
      date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      activities: acts,
    });
  }
  return itinerary;
}
