// App-wide constants
export const HOTEL_RATIO_CAB    = 0.70;
export const HOTEL_RATIO_NO_CAB = 0.90;
export const TRANSPORT_RATIO    = 0.30;

export const STAR_LABELS = { 2:"2 Star", 3:"3 Star", 4:"4 Star", 5:"5 Star" };

export const TAG_COLORS = {
  Extreme:   { bg:"#fee2e2", color:"#991b1b" },
  Water:     { bg:"#dbeafe", color:"#1e40af" },
  Adventure: { bg:"#fef3c7", color:"#92400e" },
  Sport:     { bg:"#d1fae5", color:"#065f46" },
  Nature:    { bg:"#ede9fe", color:"#4c1d95" },
};

export const CAB_TYPES = [
  { type:"Mini",    baseRate:10, perKm:8,  capacity:4 },
  { type:"Sedan",   baseRate:15, perKm:12, capacity:4 },
  { type:"SUV",     baseRate:20, perKm:15, capacity:6 },
  { type:"Premium", baseRate:30, perKm:20, capacity:4 },
];
