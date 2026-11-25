const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Persisted demo slots use English date labels as identifiers. Format only the display value.
export function slotLabel(value: string, locale: string) {
  if (locale === "en") return value;
  const match = value.match(/^\w+,? (\d{1,2}) (\w+) (\d{4}) · (.+)$/);
  if (!match) return value;
  const month = months.indexOf(match[2]);
  if (month < 0) return value;
  const date = new Date(Date.UTC(Number(match[3]), month, Number(match[1])));
  return (
    new Intl.DateTimeFormat(locale + "-ZA", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(date) +
    " · " +
    match[4]
  );
}
