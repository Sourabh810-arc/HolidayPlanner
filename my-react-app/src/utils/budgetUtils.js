// Budget and hotel/cab calculation helpers
import { HOTEL_RATIO_CAB, HOTEL_RATIO_NO_CAB, CAB_TYPES } from '../data/constants';

export function hotelBudget(budget, wantsCab) {
  return budget * (wantsCab ? HOTEL_RATIO_CAB : HOTEL_RATIO_NO_CAB);
}

export function hotelBudgetLabel(wantsCab) {
  return wantsCab ? `${HOTEL_RATIO_CAB * 100}%` : `${HOTEL_RATIO_NO_CAB * 100}%`;
}

export function pickCab(budget, hotelCost, days, cabType, travelers) {
  const remaining = budget - hotelCost;
  const dist      = cabType === "fullTrip" ? days * 50 : 50 + days * 30;
  for (const cab of CAB_TYPES) {
    if (cab.capacity >= travelers) {
      const est = cab.baseRate + dist * cab.perKm;
      if (est <= remaining) return { ...cab, estimatedCost: est, distance: dist };
    }
  }
  const def = CAB_TYPES[0];
  return { ...def, estimatedCost: def.baseRate + dist * def.perKm, distance: dist, warning: "Exceeds remaining budget" };
}
