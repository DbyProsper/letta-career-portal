"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Btn, Notice, PageTitle } from "../components/ui";
import { practitioners, services } from "../data/catalog";
import { Booking, useLocal } from "../lib/store";
import { useLanguage } from "../lib/language";
const options = ["Career guidance", ...services.map((s) => s[0])];
const stages = ["Service", "Practitioner", "Time", "Details", "Review"];
export function sampleSlots() {
  const slots: string[] = [];
  const formatter = new Intl.DateTimeFormat("en-ZA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const day = new Date();
  for (let i = 1; slots.length < 4; i++) {
    const d = new Date(
      Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate() + i),
    );
    if (d.getUTCDay() > 0 && d.getUTCDay() < 6)
      slots.push(
        formatter.format(d) +
          " · " +
          (slots.length % 2 ? "14:00" : "09:00") +
          " SAST",
      );
  }
  return slots;
}
export default function BookingFlow({
  confirmation = false,
}: {
  confirmation?: boolean;
}) {
  const { t } = useLanguage();
  const [inactive] = useLocal<string[]>("inactivePractitioners", []);
  const availablePractitioners = practitioners.filter(
    (person) => !inactive.includes(person.name),
  );
  const [bookings, save] = useLocal<Booking[]>("bookings", []),
    [step, setStep] = useState(0),
    [service, setService] = useState(""),
    [practitioner, setPractitioner] = useState(""),
    [slot, setSlot] = useState(""),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [format, setFormat] = useState("Online"),
    [error, setError] = useState(""),
    [slots, setSlots] = useState<string[]>([]);
  useEffect(() => {
    setSlots(sampleSlots());
    const params = new URLSearchParams(location.search);
    const p = params.get("practitioner"),
      s = params.get("service");
    if (options.includes(s || "")) setService(s!);
    if (practitioners.some((x) => x.name === p)) setPractitioner(p!);
  }, []);
  if (confirmation) {
    const last = bookings[0];
    return (
      <>
        <PageTitle
          group="Booking demonstration"
          title={last ? "Request saved" : "Appointment requests"}
        />
        <div className="panel form-panel">
          {last ? (
            <>
              <Notice>
                Simulated request recorded. No appointment has been booked or
                message sent.
              </Notice>
              <h2>{last.service}</h2>
              <p>
                {last.practitioner} · {last.format}
              </p>
              <p>{last.slot}</p>
              <p>Status · {last.status}</p>
              <div className="row">
                <Btn href="/individual/dashboard">View my requests</Btn>
              </div>
            </>
          ) : (
            <Btn href="/booking">Start a booking request</Btn>
          )}
        </div>
      </>
    );
  }
  const choices =
    step === 0
      ? options
      : step === 1
        ? [...availablePractitioners.map((p) => p.name), "Help me choose"]
        : slots;
  const current = [service, practitioner, slot][step];
  return (
    <>
      <PageTitle
        group="Professional support"
        title="Book a session"
        desc="Walk through a sample consultation request. Use fictional contact details."
      />
      <div className="question">
        <span className="category">
          Step {step + 1} of 5 · {stages[step]}
        </span>
        <div className="progress">
          <span style={{ width: (step + 1) * 20 + "%" }} />
        </div>
        <h2>
          {
            [
              "Choose a service",
              "Choose a sample practitioner",
              "Select an illustrative slot",
              "Enter demonstration details",
              "Review your request",
            ][step]
          }
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            if (step < 3 && !current) {
              setError("Choose an option to continue.");
              return;
            }
            if (
              step === 3 &&
              !z
                .object({ name: z.string().trim().min(2), email: z.email() })
                .safeParse({ name, email }).success
            ) {
              setError("Enter a sample name and a valid email address.");
              return;
            }
            if (step < 4) {
              setStep(step + 1);
              return;
            }
            save((old) => [
              {
                id: crypto.randomUUID(),
                service,
                practitioner,
                slot,
                name: name.trim(),
                format,
                status: "Requested",
              },
              ...old,
            ]);
            location.assign("/booking/confirmation/");
          }}
        >
          {step < 3 && (
            <div className="options">
              {choices.map((c, i) => (
                <button
                  type="button"
                  key={c}
                  className="option"
                  aria-pressed={c === current}
                  onClick={() =>
                    [setService, setPractitioner, setSlot][step](c)
                  }
                >
                  {c}
                  {step === 1 &&
                    availablePractitioners[i] &&
                    " · " + availablePractitioners[i].area}
                </button>
              ))}
            </div>
          )}
          {step === 3 && (
            <>
              <label className="field">
                {t("Name")}
                <input
                  required
                  minLength={2}
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Demo"
                />
              </label>
              <label className="field">
                {t("Email")}
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                />
              </label>
              <label className="field">
                Session format
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option>Online</option>
                  <option>In person</option>
                </select>
              </label>
            </>
          )}
          {step === 4 && (
            <>
              <p>
                {service} with {practitioner}
              </p>
              <p>
                {slot} · {format}
              </p>
              <p>
                {name} · {email}
              </p>
              <Notice>
                Demo only. Contact details are used for this preview. You can
                cancel the sample request in your individual portal.
              </Notice>
            </>
          )}
          {error && (
            <p className="form-error" role="alert">
              {t(error)}
            </p>
          )}
          <div className="pager">
            <button
              type="button"
              className="secondary"
              disabled={!step}
              onClick={() => {
                setStep(step - 1);
                setError("");
              }}
            >
              {t("Back")}
            </button>
            <button className="primary">
              {step === 4 ? "Submit simulated request" : t("Next")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
