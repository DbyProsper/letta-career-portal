"use client";
import { useLanguage } from "../lib/language";
import { useEffect, useState } from "react";
import type { Booking } from "../lib/store";
const dateLabel = new Intl.DateTimeFormat("en-ZA", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const shortLabel = (locale: string) =>
  new Intl.DateTimeFormat(locale + "-ZA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
type View = "Day" | "Week" | "Month";
function shift(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}
export function AppointmentCalendar({ bookings }: { bookings: Booking[] }) {
  const { t, locale } = useLanguage();
  const [focus, setFocus] = useState<Date | null>(null),
    [view, setView] = useState<View>("Week");
  useEffect(() => {
    const today = new Date();
    setFocus(
      new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate(),
        ),
      ),
    );
  }, []);
  if (!focus) return null;
  const first =
    view === "Month"
      ? new Date(Date.UTC(focus.getUTCFullYear(), focus.getUTCMonth(), 1))
      : view === "Week"
        ? shift(focus, -((focus.getUTCDay() + 6) % 7))
        : focus;
  const count =
    view === "Month"
      ? new Date(
          Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0),
        ).getUTCDate()
      : view === "Week"
        ? 7
        : 1;
  function step(direction: number) {
    if (view === "Month")
      setFocus(
        new Date(
          Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + direction, 1),
        ),
      );
    else setFocus(shift(first, count * direction));
  }
  return (
    <section className="panel calendar">
      <h2>{t("Appointment calendar")}</h2>
      <div className="row">
        {(["Day", "Week", "Month"] as const).map((v) => (
          <button
            key={v}
            className="chip"
            aria-pressed={view === v}
            onClick={() => setView(v)}
          >
            {t(v)}
          </button>
        ))}
      </div>
      <div className="pager">
        <button className="secondary" onClick={() => step(-1)}>
          {t("Previous")}
        </button>
        <b>
          {first.toLocaleDateString(locale + "-ZA", {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          })}
        </b>
        <button className="secondary" onClick={() => step(1)}>
          {t("Next")}
        </button>
      </div>
      <div className={"calendar-days " + view.toLowerCase()}>
        {Array.from({ length: count }, (_, i) => {
          const d = shift(first, i);
          const entries = bookings.filter(
            (b) =>
              b.status !== "Cancelled" &&
              b.slot.startsWith(dateLabel.format(d) + " ·"),
          );
          return (
            <div key={i}>
              <b>{shortLabel(locale).format(d)}</b>
              {entries.map((b) => (
                <span key={b.id}>
                  {t(b.slot.split(" · ")[1])} · {b.name}
                </span>
              ))}
              {view === "Day" && !entries.length && (
                <p>{t("No requests scheduled for this day.")}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
