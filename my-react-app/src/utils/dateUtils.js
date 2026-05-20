// Date utility functions
export function localDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseLocalDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;

  const dateStr = String(value).split("T")[0];
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return new Date(y, m - 1, d);
}

export function formatDate(value) {
  const date = parseLocalDate(value);
  if (!date || isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
  });
}

export function calculateDays(ci, co) {
  const days = Math.round((parseLocalDate(co) - parseLocalDate(ci)) / 86400000);
  return days > 0 ? days : 1;
}
