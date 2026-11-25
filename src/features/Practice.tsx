"use client";
import { PractitionerIdentity } from "../components/PractitionerIdentity";
import { slotLabel } from "../lib/slotLabel";
import { useLanguage } from "../lib/language";
import { AppointmentCalendar } from "./AppointmentCalendar";
import { useState } from "react";
import { A, Btn, Notice, PageTitle, SearchField } from "../components/ui";
import { Article, Booking, Enquiry, useLocal } from "../lib/store";
import { practitioners, services, practiceTabs, slug } from "../data/catalog";
import { sampleSlots } from "./Booking";
import { downloadPDF } from "./Toolkit";
const clean: Article = {
  id: "",
  title: "",
  body: "",
  category: "Career guidance",
  language: "English",
  published: false,
};
function Studio() {
  const { t } = useLanguage();
  const [items, save] = useLocal<Article[]>("articles", []),
    [draft, setDraft] = useState<Article>(clean),
    [preview, setPreview] = useState(false),
    [msg, setMsg] = useState("");
  function commit(published: boolean) {
    const next = {
      ...draft,
      title: draft.title.trim(),
      body: draft.body.trim(),
      id: draft.id || crypto.randomUUID(),
      published,
    };
    save((old) => [next, ...old.filter((a) => a.id !== next.id)]);
    setDraft(next);
    setMsg(
      published
        ? "Published to the resource library in this browser."
        : "Draft saved.",
    );
    setPreview(false);
  }
  return (
    <>
      <div className="split">
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.title.trim() || !draft.body.trim()) {
              setMsg("Enter a title and article text.");
              return;
            }
            const action = (
              (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
            )?.value;
            if (action === "preview") {
              setPreview(true);
              setMsg("");
            } else commit(action === "publish");
          }}
        >
          <h2>{t(draft.id ? "Edit content" : "Create content")}</h2>
          <label className="field">
            {t("Article title")}
            <input
              required
              maxLength={120}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </label>
          <label className="field">
            {t("Category")}
            <select
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            >
              {[
                "Career guidance",
                "Wellness",
                "Educational resource",
                "Event",
                "Video",
                "Career profile",
              ].map((v) => (
                <option key={v} value={v}>
                  {t(v)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            {t("Language")}
            <select
              value={draft.language}
              onChange={(e) => setDraft({ ...draft, language: e.target.value })}
            >
              {["English", "isiZulu", "Sesotho", "Setswana", "isiXhosa"].map(
                (v) => (
                  <option key={v} value={v}>
                    {t(v)}
                  </option>
                ),
              )}
            </select>
          </label>
          <label className="field">
            {t("Article text")}
            <textarea
              required
              rows={7}
              maxLength={8000}
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            />
          </label>
          <label className="field">
            {t("Cover image")}
            <select
              value={draft.image || ""}
              onChange={(e) => setDraft({ ...draft, image: e.target.value })}
            >
              <option value="">{t("No image")}</option>
              <option value="career">{t("Career discovery")}</option>
              <option value="wellness">{t("Wellness")}</option>
              <option value="support">{t("Professional support")}</option>
            </select>
          </label>
          <div className="row">
            <button className="secondary" value="draft">
              {t("Save draft")}
            </button>
            <button className="secondary" value="preview">
              {t("Preview")}
            </button>
            <button className="primary" value="publish">
              {t("Publish")}
            </button>
          </div>
        </form>
        <div className="panel">
          <h2>{t(preview ? "Article preview" : "Your content")}</h2>
          {preview ? (
            <>
              <span className="category">{t(draft.category)}</span>
              <h3>{draft.title}</h3>
              {draft.image && (
                <img
                  className="article-image"
                  src={"/images/path-" + draft.image + ".webp"}
                  alt=""
                />
              )}
              <p>{draft.body}</p>
            </>
          ) : items.length ? (
            items.map((a) => (
              <div className="list-item" key={a.id}>
                <small>
                  {t(a.published ? "Published" : "Draft")} · {t(a.language)}
                </small>
                <h3>{a.title}</h3>
                <button
                  className="secondary"
                  onClick={() => {
                    setDraft(a);
                    setMsg("");
                  }}
                >
                  {t("Edit article")}
                </button>
              </div>
            ))
          ) : (
            <p>{t("Saved drafts and published articles appear here.")}</p>
          )}
          <div className="row">
            <button
              className="secondary"
              onClick={() => {
                setDraft(clean);
                setPreview(false);
                setMsg("");
              }}
            >
              {t("New article")}
            </button>
          </div>
        </div>
      </div>
      {msg && (
        <Notice>
          {t(msg)}{" "}
          <A className="ink-link" href="/resources">
            {t("Open resources")}
          </A>
        </Notice>
      )}
    </>
  );
}
export default function Practice({ path }: { path: string }) {
  const { t, locale } = useLanguage();
  const tab =
    practiceTabs.find((v) => path.endsWith("/" + slug(v))) || "Overview";
  const [requests, setRequests] = useLocal<Booking[]>("bookings", []),
    [examples, setExamples] = useLocal<Booking[]>("practiceExampleBookings", [
      {
        id: "sample-alex",
        name: "Alex Demo",
        service: "Career guidance",
        practitioner: "Naledi M.",
        format: "Online",
        slot: "Thu, 26 Nov 2026 · 09:00 SAST",
        status: "Allocated",
      },
      {
        id: "sample-sam",
        name: "Sam Demo",
        service: "Soft Skills Training",
        practitioner: "Ayesha D.",
        format: "In person",
        slot: "Fri, 27 Nov 2026 · 14:00 SAST",
        status: "Requested",
      },
    ]),
    [enquiries, setEnquiries] = useLocal<Enquiry[]>("enquiries", []),
    [items] = useLocal<Article[]>("articles", []),
    [events, setEvents] = useLocal<{ title: string; date: string }[]>(
      "events",
      [],
    ),
    [query, setQuery] = useState(""),
    [active, Active] = useLocal<string[]>("inactivePractitioners", []),
    [registrations] = useLocal<string[]>("eventRegistrations", []),
    [attended, setAttended] = useLocal<string[]>("eventAttendance", []),
    [settings, setSettings] = useLocal("practiceSettings", {
      notifications: true,
    }),
    [assessment, setAssessment] = useLocal(
      "assessmentStatus",
      "Awaiting practitioner review",
    ),
    [invoice, setInvoice] = useLocal("invoice", "Pending"),
    [note, setNote] = useState("");
  const matches = (s: string) => s.toLowerCase().includes(query.toLowerCase());
  const bookings = [...requests, ...examples];
  const change = (id: string, update: Partial<Booking>) =>
    (examples.some((b) => b.id === id) ? setExamples : setRequests)((old) =>
      old.map((b) => (b.id === id ? { ...b, ...update } : b)),
    );
  const counts = [
    [new Set(bookings.map((b) => b.name)).size, "Clients"],
    [
      bookings.filter((b) => b.status === "Requested").length,
      "Pending requests",
    ],
    [enquiries.filter((e) => e.status === "New").length, "New enquiries"],
    [
      practitioners.filter((p) => !active.includes(p.name)).length,
      "Active practitioners",
    ],
    [events.length + 2, "Sample events"],
    [items.filter((a) => a.published).length, "Published resources"],
  ];
  return (
    <>
      <PageTitle
        group="Practice workspace · Demonstration"
        title={t(tab === "Overview" ? "Practice overview" : tab)}
      />
      {tab === "Overview" && (
        <>
          <div className="metrics">
            {counts.map(([n, label]) => (
              <div className="metric" key={label}>
                <b>{n}</b>
                <span>{t(String(label))}</span>
              </div>
            ))}
          </div>
          <div className="split">
            <div className="panel">
              <h2>{t("Recent requests")}</h2>
              {bookings.slice(0, 3).map((b) => (
                <p key={b.id} className="list-item">
                  {b.name} · {t(b.service)}
                  <br />
                  {slotLabel(b.slot, locale)}
                </p>
              ))}
              {!bookings.length && <p>{t("No appointment requests yet.")}</p>}
              <A href="/practice/appointments" className="ink-link">
                {t("Manage appointments")}
              </A>
            </div>
            <div className="panel">
              <h2>{t("Recent enquiries")}</h2>
              {enquiries.slice(0, 3).map((e) => (
                <p key={e.id} className="list-item">
                  {t(e.organisation)} · {t(e.programme)}
                </p>
              ))}
              {!enquiries.length && <p>{t("No enquiries yet.")}</p>}
              <A href="/practice/schools" className="ink-link">
                {t("Review enquiries")}
              </A>
            </div>
          </div>
        </>
      )}
      {tab === "Content Studio" && <Studio />}
      {tab === "Practitioners" && (
        <div className="tiles team-grid">
          {practitioners.map((p) => (
            <div
              className={p.founder ? "panel founder-card" : "panel"}
              key={p.name}
            >
              <PractitionerIdentity person={p} />
              <p>{t(p.about)}</p>
              {!p.founder && (
                <details>
                  <summary>{t("Professional details")}</summary>
                  <p>
                    {t(
                      "Qualifications and registration are awaiting verification. Sample availability is shown inside the booking demo.",
                    )}
                  </p>
                </details>
              )}
              <label className="check">
                <input
                  type="checkbox"
                  checked={!active.includes(p.name)}
                  onChange={() =>
                    Active(
                      active.includes(p.name)
                        ? active.filter((n) => n !== p.name)
                        : [...active, p.name],
                    )
                  }
                />
                {t("Active")}
              </label>
            </div>
          ))}
        </div>
      )}
      {tab === "Clients" && (
        <>
          <SearchField
            value={query}
            set={setQuery}
            placeholder={t("Search demo clients")}
          />
          <div className="panel">
            {Array.from(new Set(["Alex Demo", ...bookings.map((b) => b.name)]))
              .filter(matches)
              .map((n) => (
                <details key={n}>
                  <summary>{t(n)}</summary>
                  <p>{t("Sample client · Administrative record")}</p>
                  {bookings
                    .filter((b) => b.name === n)
                    .map((b) => (
                      <p key={b.id}>
                        {t(b.service)} · {t(b.status)}
                      </p>
                    ))}
                </details>
              ))}
          </div>
        </>
      )}
      {tab === "Appointments" && (
        <>
          <AppointmentCalendar bookings={bookings} />
          <SearchField
            value={query}
            set={setQuery}
            placeholder={t("Search requests by name or service")}
          />
          <div className="panel">
            {bookings
              .filter((b) =>
                matches([b.name, b.service, t(b.service)].join(" ")),
              )
              .map((b) => (
                <details key={b.id}>
                  <summary>
                    {b.name} · {t(b.service)} · {t(b.status)}
                  </summary>
                  <p>
                    {slotLabel(b.slot, locale)} · {t(b.format)}
                  </p>
                  <label className="field">
                    {t("Status")}
                    <select
                      value={b.status}
                      onChange={(e) => change(b.id, { status: e.target.value })}
                    >
                      {["Requested", "Allocated", "Completed", "Cancelled"].map(
                        (s) => (
                          <option key={s} value={s}>
                            {t(s)}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                  <label className="field">
                    {t("Practitioner")}
                    <select
                      value={b.practitioner}
                      onChange={(e) =>
                        change(b.id, { practitioner: e.target.value })
                      }
                    >
                      {Array.from(
                        new Set([
                          b.practitioner,
                          ...practitioners.map((p) => p.name),
                        ]),
                      ).map((s) => (
                        <option key={s} value={s}>
                          {t(s)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    {t("Reschedule sample slot")}
                    <select
                      value={b.slot}
                      onChange={(e) => change(b.id, { slot: e.target.value })}
                    >
                      {Array.from(new Set([b.slot, ...sampleSlots()])).map(
                        (s) => (
                          <option key={s} value={s}>
                            {slotLabel(s, locale)}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                </details>
              ))}
            {!bookings.filter((b) => matches(b.name + " " + b.service))
              .length && (
              <p>
                {t(
                  "No matching requests. Create one using the booking demonstration.",
                )}
              </p>
            )}
            <div className="row">
              <Btn href="/booking">{t("New sample request")}</Btn>
            </div>
          </div>
        </>
      )}
      {tab === "Schools" && (
        <div className="panel">
          <h2>{t("Partnership and workshop enquiries")}</h2>
          {enquiries.map((en) => (
            <div key={en.id} className="list-item">
              <b>{en.organisation}</b>
              <p>
                {t(en.role)} · {t(en.programme)}
              </p>
              <label className="field">
                {t("Request status")}
                <select
                  value={en.status}
                  onChange={(e) =>
                    setEnquiries((old) =>
                      old.map((i) =>
                        i.id === en.id ? { ...i, status: e.target.value } : i,
                      ),
                    )
                  }
                >
                  {["New", "In review", "Follow-up arranged", "Closed"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {t(s)}
                      </option>
                    ),
                  )}
                </select>
              </label>
            </div>
          ))}
          {!enquiries.length && (
            <p>
              {t(
                "Sample enquiries from school, parent and corporate portals will appear here.",
              )}
            </p>
          )}
        </div>
      )}
      {tab === "Assessments" && (
        <div className="panel">
          <span className="category">{t("Demonstration only")}</span>
          <h2>{t("Assessment administration")}</h2>
          <p>{t("Sample allocation · Alex Demo · Practitioner-led review")}</p>
          <label className="field">
            {t("Workflow status")}
            <select
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
            >
              {[
                "Awaiting practitioner review",
                "Allocated",
                "Review complete",
              ].map((s) => (
                <option key={s} value={s}>
                  {t(s)}
                </option>
              ))}
            </select>
          </label>
          <details>
            <summary>{t("Digital assessment workflow")}</summary>
            <p>
              {t(
                "Future workflow: practitioner selection, consent, authorised administration and practitioner review. Licensing and professional approval are required.",
              )}
            </p>
          </details>
          <details>
            <summary>{t("Practitioner-administered workflow")}</summary>
            <p>
              {t(
                "A qualified practitioner would schedule and administer an approved instrument, then review the restricted report.",
              )}
            </p>
          </details>
        </div>
      )}
      {tab === "Reports" && (
        <div className="panel">
          <span className="category">{t("Sample report · Completed")}</span>
          <h2>{t("Practice activity summary")}</h2>
          <p>
            {t(
              "Administrative counts for this browser's demonstration records.",
            )}
          </p>
          <div className="row">
            <button
              className="primary"
              onClick={async () => {
                await downloadPDF("Demo practice summary", [
                  {
                    title: t("Demonstration practice summary"),
                    text: counts
                      .map(([n, label]) => t(String(label)) + ": " + n)
                      .join("\n"),
                  },
                ]);
                setNote("Sample report downloaded.");
              }}
            >
              {t("Download sample report")}
            </button>
          </div>
          {note && <Notice>{t(note)}</Notice>}
        </div>
      )}
      {tab === "Events" && (
        <div className="panel">
          <h2>{t("Create a sample event")}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = e.currentTarget,
                d = new FormData(f),
                title = String(d.get("title")).trim();
              if (!title) return;
              setEvents((old) => [
                ...old,
                { title, date: String(d.get("date")) },
              ]);
              f.reset();
            }}
          >
            <label className="field">
              {t("Event name")}
              <input required name="title" maxLength={120} />
            </label>
            <label className="field">
              {t("Event date")}
              <input required name="date" type="date" />
            </label>
            <button className="primary">{t("Create event")}</button>
          </form>
          {events.map((v, i) => (
            <p key={i} className="list-item">
              {t(v.title)} · {t(v.date)}
            </p>
          ))}
          <A href="/events" className="ink-link">
            {t("View public events")}
          </A>
          <h3>{t("Sample registrations and attendance")}</h3>
          {registrations.length ? (
            registrations.map((event) => (
              <label key={event} className="check">
                <input
                  type="checkbox"
                  checked={attended.includes(event)}
                  onChange={() =>
                    setAttended((old) =>
                      old.includes(event)
                        ? old.filter((v) => v !== event)
                        : [...old, event],
                    )
                  }
                />
                {t(event)} {t("· Attended")}
              </label>
            ))
          ) : (
            <p>{t("Registrations from the events page appear here.")}</p>
          )}
        </div>
      )}
      {tab === "Services" && (
        <div className="panel">
          {services.map(([n, d]) => (
            <details key={n}>
              <summary>{t(n)}</summary>
              <p>{t(d)}</p>
              <small>{t("Pricing · To be confirmed")}</small>
            </details>
          ))}
        </div>
      )}
      {tab === "Finance" && (
        <div className="panel">
          <span className="category">{t("Sample invoice")}</span>
          <h2>{t("School workshop")}</h2>
          <p>{t("Illustrative invoice · DEMO-001")}</p>
          <label className="field">
            {t("Payment status")}
            <select
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
            >
              <option value="Pending">{t("Pending")}</option>
              <option value="Paid (demo)">{t("Paid (demo)")}</option>
              <option value="Cancelled">{t("Cancelled")}</option>
            </select>
          </label>
          <p className="meta">{t("Payment processing is deferred.")}</p>
        </div>
      )}
      {tab === "Settings" && (
        <div className="panel">
          <h2>{t("Practice preferences")}</h2>
          <p>{t("Letta Consulting · Practice team demo role")}</p>
          <label className="check">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({ notifications: e.target.checked })}
            />
            {t("Show overview notification")}
          </label>
          <A href="/portal" className="ink-link">
            {t("Switch demonstration role")}
          </A>
        </div>
      )}
      {tab === "Overview" && settings.notifications && (
        <Notice>
          {t("Practice notifications ·")}{" "}
          {bookings.filter((b) => b.status === "Requested").length}{" "}
          {t("appointment requests awaiting review.")}
        </Notice>
      )}
    </>
  );
}
