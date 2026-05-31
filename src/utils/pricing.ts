import { isWithinInterval, parseISO } from "date-fns";

export interface Season {
  name: string;
  key: string;
  startDate: string; // "MM-DD" or full date? The table has specific years: 2025-2027. We should use full dates.
  endDate: string;
  priceNautilus: number; // per day
  priceValeFurado: number; // per day
  priceNautilusWeek: number; // per week
  priceValeFuradoWeek: number; // per week
}

// Ensure the seasons are matched in priority order!
// 1. Christmas & Easter
// 2. High Season
// 3. Mid Season High
// 4. Mid Season Low
// 5. Low Season
export const SEASONS: Season[] = [
  // Christmas & Easter
  { name: "Christmas & Easter", key: "holiday", startDate: "2025-12-21", endDate: "2026-01-02", priceNautilus: 143, priceValeFurado: 157, priceNautilusWeek: 1000, priceValeFuradoWeek: 1100 },
  { name: "Christmas & Easter", key: "holiday", startDate: "2026-03-28", endDate: "2026-04-10", priceNautilus: 143, priceValeFurado: 157, priceNautilusWeek: 1000, priceValeFuradoWeek: 1100 },
  { name: "Christmas & Easter", key: "holiday", startDate: "2026-12-19", endDate: "2027-01-02", priceNautilus: 143, priceValeFurado: 157, priceNautilusWeek: 1000, priceValeFuradoWeek: 1100 },
  
  // High Season
  { name: "High season", key: "high", startDate: "2026-06-27", endDate: "2026-09-04", priceNautilus: 143, priceValeFurado: 157, priceNautilusWeek: 1000, priceValeFuradoWeek: 1100 },
  
  // Mid Season High
  { name: "Mid season high", key: "midhigh", startDate: "2026-05-02", endDate: "2026-06-26", priceNautilus: 108, priceValeFurado: 119, priceNautilusWeek: 756, priceValeFuradoWeek: 832 },
  { name: "Mid season high", key: "midhigh", startDate: "2026-09-05", endDate: "2026-10-02", priceNautilus: 108, priceValeFurado: 119, priceNautilusWeek: 756, priceValeFuradoWeek: 832 },

  // Mid Season Low
  { name: "Mid season low", key: "midlow", startDate: "2026-03-28", endDate: "2026-05-01", priceNautilus: 94, priceValeFurado: 104, priceNautilusWeek: 660, priceValeFuradoWeek: 726 },
  { name: "Mid season low", key: "midlow", startDate: "2026-10-03", endDate: "2026-10-30", priceNautilus: 94, priceValeFurado: 104, priceNautilusWeek: 660, priceValeFuradoWeek: 726 },

  // Low Season
  { name: "Low season", key: "low", startDate: "2025-11-01", endDate: "2025-12-20", priceNautilus: 79, priceValeFurado: 87, priceNautilusWeek: 556, priceValeFuradoWeek: 612 },
  { name: "Low season", key: "low", startDate: "2026-01-03", endDate: "2026-03-27", priceNautilus: 79, priceValeFurado: 87, priceNautilusWeek: 556, priceValeFuradoWeek: 612 },
  { name: "Low season", key: "low", startDate: "2026-10-31", endDate: "2026-12-18", priceNautilus: 79, priceValeFurado: 87, priceNautilusWeek: 556, priceValeFuradoWeek: 612 },
];

export function getPriceForDate(apartmentId: "nautilus" | "valefurado", date: Date): number {
  for (const season of SEASONS) {
    const start = parseISO(season.startDate);
    const end = parseISO(season.endDate);
    
    // Add time to ends to include the whole end day
    end.setHours(23, 59, 59, 999);
    
    if (isWithinInterval(date, { start, end })) {
      return apartmentId === "nautilus" ? season.priceNautilus : season.priceValeFurado;
    }
  }
  
  // Default to low season price if date is out of any defined bounds
  return apartmentId === "nautilus" ? 79 : 87;
}

export function calculateBasePrice(apartmentId: "nautilus" | "valefurado", checkIn: Date, checkOut: Date): number {
  let total = 0;
  // Iterate through each night
  // The user checks in on `checkIn` and checks out on `checkOut`.
  // The number of nights is the number of days between them.
  let currentDate = new Date(checkIn);
  currentDate.setHours(12, 0, 0, 0); // avoid daylight saving issues

  const endDate = new Date(checkOut);
  endDate.setHours(12, 0, 0, 0);

  while (currentDate < endDate) {
    total += getPriceForDate(apartmentId, currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return total;
}

export function calculateTotalPrice(apartmentId: "nautilus" | "valefurado", checkIn: Date, checkOut: Date): number {
  const basePrice = calculateBasePrice(apartmentId, checkIn, checkOut);
  return basePrice + 140; // Add fixed cleaning fee
}
