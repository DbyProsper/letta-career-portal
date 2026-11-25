"use client";
import { slotLabel } from "../lib/slotLabel";
import { useLanguage } from "../lib/language";
import { useState } from "react";
import { A, Btn, Cards, Notice, PageTitle } from "../components/ui";
import { programs, roles } from "../data/catalog";
import { Booking, Enquiry, useLocal } from "../lib/store";
export function PortalIndex() {
  const { t } = useLanguage();
  return (
    <>
      <PageTitle
        group="Letta Consulting"
        title={t("Find your portal")}
        desc="Choose the workspace that fits what you want to do today."
      />
      <Cards
        items={roles.map(([n, p], i) => [
          n,
          p,
          [
            "Explore your interests and career pathways.",
            "Manage simulated appointment requests.",
            "Support your child's next steps.",
            "Plan a school programme.",
            "Explore employee wellness services.",
            "Manage sample requests and publish resources.",
          ][i],
        ])}
      />
    </>
  );
}
export function EnquiryForm({
  role,
  options,
}: {
  role: string;
  options: readonly string[];
}) {
  const { t } = useLanguage();
  const [, save] = useLocal<Enquiry[]>("enquiries", []),
    [status, setStatus] = useState("");
  return (
    <form
      className="panel form-panel"
      onSubmit={(e) => {
        e.preventDefault();
        const f = e.currentTarget;
        const data = new FormData(f);
        const organisation = String(data.get("organisation")).trim(),
          programme = String(data.get("programme"));
        if (!organisation) return;
        save((old) => [
          {
            id: crypto.randomUUID(),
            role,
            organisation,
            programme,
            status: "New",
          },
          ...old,
        ]);
        setStatus(
          "Simulated request saved. The practice team can view it in the demo dashboard.",
        );
        f.reset();
      }}
    >
      <h2>{t(role === "Parent" ? "Request a workshop" : "Make an enquiry")}</h2>
      <p>{t("Use fictional details for this demonstration.")}</p>
      <label className="field">
        {t(
          role === "Parent" ? "Sample family name" : "Sample organisation name",
        )}
        <input name="organisation" required pattern=".*\S.*" maxLength={100} />
      </label>
      <label className="field">
        {t("Programme")}
        <select name="programme">
          {options.map((n) => (
            <option key={n} value={n}>
              {t(n)}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        {t("Demo contact email")}
        <input
          required
          name="email"
          type="email"
          placeholder="contact@example.com"
        />
      </label>
      <button className="primary">{t("Submit demo request")}</button>
      {status && <Notice>{t(status)}</Notice>}
    </form>
  );
}
export function RoleDashboard({ path }: { path: string }) {
  const { t, locale } = useLanguage();
  const role = path.split("/")[1];
  const [bookings, save] = useLocal<Booking[]>("bookings", []),
    [prefs, set] = useLocal("preferences", {
      reminders: false,
      resources: false,
    }),
    [consent, setConsent] = useLocal("consent", false),
    [invoice] = useLocal("invoice", "Pending"),
    [feedback, setFeedback] = useLocal<string[]>("schoolFeedback", []),
    [enquiries] = useLocal<Enquiry[]>("enquiries", []);
  if (role === "individual")
    return (
      <>
        <PageTitle
          group="Individual portal"
          title={t("My appointments")}
          desc="Review your sample appointment requests and communication preferences."
        />
        <div className="panel">
          <h2>{t("Appointment history")}</h2>
          {bookings.length ? (
            bookings.map((b) => (
              <div className="list-item" key={b.id}>
                <span className="category">{t(b.status)}</span>
                <h3>{t(b.service)}</h3>
                <p>
                  {b.name} · {slotLabel(b.slot, locale)} · {t(b.practitioner)} ·{" "}
                  {t(b.format)}
                </p>
                {b.status !== "Cancelled" && (
                  <button
                    className="secondary"
                    onClick={() =>
                      save((old) =>
                        old.map((it) =>
                          it.id === b.id ? { ...it, status: "Cancelled" } : it,
                        ),
                      )
                    }
                  >
                    {t("Cancel demo request")}
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>{t("Your sample requests will appear here.")}</p>
          )}
          <div className="row">
            <Btn href="/booking">{t("Book a session")}</Btn>
            <Btn href="/resources" light>
              {t("View resources")}
            </Btn>
          </div>
        </div>
        <div className="panel">
          <h2>{t("Communication preferences")}</h2>
          {(["reminders", "resources"] as const).map((k) => (
            <label className="check" key={k}>
              <input
                type="checkbox"
                checked={prefs[k]}
                onChange={(e) => set({ ...prefs, [k]: e.target.checked })}
              />
              {t(
                k === "reminders"
                  ? "Appointment reminders"
                  : "Resource updates",
              )}
            </label>
          ))}
          <small>{t("Demonstration settings · Delivery is disabled.")}</small>
        </div>
      </>
    );
  if (role === "parent")
    return (
      <>
        <PageTitle
          group="Parent & guardian portal"
          title={t("Support their next step")}
          desc="Explore family resources, workshops and the information shared with you."
        />
        <div className="split">
          <div className="panel">
            <span className="category">{t("Simulated child profile")}</span>
            <h2>{t("Alex Demo")}</h2>
            <p>{t("Grade 10 · Subject selection")}</p>
            <h3>{t("Sharing preferences")}</h3>
            <label className="check">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              {t("Demonstrate sharing a career activity summary")}
            </label>
            {consent && (
              <Notice>
                {t("Sample summary · Alex explored two career fields.")}
              </Notice>
            )}
            <p className="meta">
              {t(
                "Private reflections and counselling records are excluded from family summaries.",
              )}
            </p>
          </div>
          <div className="panel">
            <h2>{t("For families")}</h2>
            <details>
              <summary>{t("Talk about subject choices")}</summary>
              <p>
                {t(
                  "Ask which subjects your child enjoys and what they hope to try. Explore a career profile together and compare possible pathways.",
                )}
              </p>
            </details>
            <A href="/careers" className="ink-link">
              {t("Browse study pathways")}
            </A>
            <div className="row">
              <Btn href="/booking" light>
                {t("Request guidance")}
              </Btn>
            </div>
          </div>
        </div>
        <EnquiryForm
          role="Parent"
          options={["Family career workshop", "Subject selection evening"]}
        />
      </>
    );
  const school = role === "school",
    title = school ? "School partnerships" : "Corporate wellness",
    group = school ? "School" : "Corporate";
  const opts = school
    ? programs
    : [
        "Employee Assistance Program",
        "Wellness Services",
        "Soft Skills Training",
        "Medico-Legal Services",
      ];
  return (
    <>
      <PageTitle
        group={group + " portal"}
        title={t(title)}
        desc={
          school
            ? "Explore programmes for learners and send a sample partnership enquiry."
            : "Explore workplace support and request a demonstration consultation."
        }
      />
      <div className="panel">
        <h2>{t(school ? "School programmes" : "Organisational services")}</h2>
        {opts.map((s, i) => (
          <details key={s}>
            <summary>{t(s)}</summary>
            <p>
              {t(
                school
                  ? [
                      "A guided introduction to career fields and daily tasks.",
                      "Explore links between school subjects and possible pathways.",
                      "Build a practical checklist for the year after matric.",
                      "Discuss study choices and preparing for campus.",
                      "Practise applications, interviews and CV preparation.",
                      "Discuss everyday wellbeing and finding support.",
                    ][i]
                  : [
                      "Explore preventative support for employees.",
                      "Plan a workplace wellbeing programme.",
                      "Discuss communication and team development workshops.",
                      "Ask about the business's medico-legal service offering.",
                    ][i],
              )}
            </p>
          </details>
        ))}
      </div>
      <EnquiryForm role={group} options={opts} />
      {school && (
        <div className="panel">
          <h2>{t("Sample school programme")}</h2>
          <p>{t("Demo Academy · Career Discovery Day")}</p>
          <p>
            {t("Workshop invoice DEMO-001 ·")} {t(invoice)}
          </p>
          <details>
            <summary>{t("Programme feedback")}</summary>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const value = String(new FormData(form).get("feedback")).trim();
                if (value) {
                  setFeedback((old) => [...old, value]);
                  form.reset();
                }
              }}
            >
              <label className="field">
                {t("Sample feedback")}
                <textarea name="feedback" required maxLength={400} />
              </label>
              <button className="secondary">{t("Save feedback")}</button>
            </form>
            {feedback.map((v, i) => (
              <p className="list-item" key={i}>
                {t(v)}
              </p>
            ))}
          </details>
        </div>
      )}
      <div className="panel">
        <h2>{t("Programme requests")}</h2>
        {enquiries.some((e) => e.role === group) ? (
          enquiries
            .filter((e) => e.role === group)
            .map((e) => (
              <p className="list-item" key={e.id}>
                {t(e.programme)} · {t(e.organisation)} · {t(e.status)}
              </p>
            ))
        ) : (
          <p>{t("Your organisation's simulated requests will appear here.")}</p>
        )}
      </div>
    </>
  );
}
