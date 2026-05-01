import { addHours, addDays, format, startOfDay } from "date-fns";

/** YYYY-MM-DD bounds matching POST /api/orders (24h min, 30d max). */
export function orderDeliveryDateBounds() {
  const min = startOfDay(addHours(new Date(), 24));
  const max = startOfDay(addDays(new Date(), 30));
  return {
    min: format(min, "yyyy-MM-dd"),
    max: format(max, "yyyy-MM-dd"),
  };
}
