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
