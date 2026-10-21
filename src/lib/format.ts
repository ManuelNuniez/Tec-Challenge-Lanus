const pesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

// Amounts are stored in cents: 97885 -> "$ 978,85".
export function formatAmount(cents: number) {
  return pesos.format(cents / 100);
}

// Card expiry as printed on the card: month 2, year 2030 -> "02/30".
export function formatExpiry(month: number, year: number) {
  return `${String(month).padStart(2, "0")}/${String(year % 100).padStart(2, "0")}`;
}

// Movement dates are shown in Argentina time, wherever the server runs.
const TIME_ZONE = "America/Argentina/Buenos_Aires";

const longDate = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TIME_ZONE,
});

const time = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: TIME_ZONE,
});

// "17 de octubre de 2026"
export function formatLongDate(date: Date) {
  return longDate.format(date);
}

// "14:30 h"
export function formatTime(date: Date) {
  return `${time.format(date)} h`;
}

// CUIT/CUIL with its usual dashes: "20301254785" -> "20-30125478-5".
export function formatTaxId(taxId: string) {
  return `${taxId.slice(0, 2)}-${taxId.slice(2, 10)}-${taxId.slice(10)}`;
}
