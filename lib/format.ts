export function formatCents(cents: number, currency = "USD") {
  const code = currency || "USD";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(cents / 100);
  } catch {
    // Fall back to USD if an unsupported currency code is stored.
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  }
}

export function toCents(value: FormDataEntryValue | null) {
  const amount = Number(value ?? 0);
  return Math.round(amount * 100);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}
