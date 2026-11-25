"use client";
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
          <h2>{draft.id ? "Edit content" : "Create content"}</h2>
          <label className="field">
            Article title
            <input
              required
              maxLength={120}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </label>
          <label className="field">
            Category
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
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="field">
            Language
            <select
              value={draft.language}
              onChange={(e) => setDraft({ ...draft, language: e.target.value })}
            >
              {["English", "isiZulu", "Sesotho", "Setswana", "isiXhosa"].map(
                (v) => (
                  <option key={v}>{v}</option>
                ),
              )}
            </select>
          </label>
          <label className="field">
            Article text
            <textarea
              required
              rows={7}
              maxLength={8000}
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            />
          </label>
          <label className="field">
            Cover image
            <select
              value={draft.image || ""}
              onChange={(e) => setDraft({ ...draft, image: e.target.value })}
            >
              <option value="">No image</option>
              <option value="career">Career discovery</option>
              <option value="wellness">Wellness</option>
              <option value="support">Professional support</option>
            </select>
          </label>
          <div className="row">
            <button className="secondary" value="draft">
              Save draft
            </button>
            <button className="secondary" value="preview">
              Preview
            </button>
            <button className="primary" value="publish">
              Publish
            </button>
          </div>
        </form>
        <div className="panel">
          <h2>{preview ? "Article preview" : "Your content"}</h2>
          {preview ? (
            <>
              <span className="category">{draft.category}</span>
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
                  {a.published ? "Published" : "Draft"} · {a.language}
                </small>
                <h3>{a.title}</h3>
                <button
                  className="secondary"
                  onClick={() => {
                    setDraft(a);
                    setMsg("");
                  }}
                >
                  Edit article
                </button>
              </div>
            ))
          ) : (
            <p>Saved drafts and published articles appear here.</p>
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
              New article
            </button>
          </div>
        </div>
      </div>
      {msg && (
        <Notice>
          {msg}{" "}
          <A className="ink-link" href="/resources">
            Open resources
          </A>
        </Notice>
      )}
    </>
  );
}
export default function Practice({ path }: { path: string }) {
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
    [3 - active.length, "Active practitioners"],
    [events.length + 2, "Sample events"],
    [items.filter((a) => a.published).length, "Published resources"],
  ];
  return (
    <>
      <PageTitle
        group="Practice workspace · Demonstration"
        title={tab === "Overview" ? "Practice overview" : tab}
      />
      {tab === "Overview" && (
        <>
          <div className="metrics">
            {counts.map(([n, t]) => (
              <div className="metric" key={t}>
                <b>{n}</b>
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div className="split">
            <div className="panel">
              <h2>Recent requests</h2>
              {bookings.slice(0, 3).map((b) => (
                <p key={b.id} className="list-item">
                  {b.name} · {b.service}
                  <br />
                  {b.slot}
                </p>
              ))}
              {!bookings.length && <p>No appointment requests yet.</p>}
              <A href="/practice/appointments" className="ink-link">
                Manage appointments
              </A>
            </div>
            <div className="panel">
              <h2>Recent enquiries</h2>
              {enquiries.slice(0, 3).map((e) => (
                <p key={e.id} className="list-item">
                  {e.organisation} · {e.programme}
                </p>
              ))}
              {!enquiries.length && <p>No enquiries yet.</p>}
              <A href="/practice/schools" className="ink-link">
                Review enquiries
              </A>
            </div>
          </div>
        </>
      )}
      {tab === "Content Studio" && <Studio />}
      {tab === "Practitioners" && (
        <div className="tiles">
          {practitioners.map((p) => (
            <div className="panel" key={p.name}>
              <img
                className="practitioner-photo"
                src={
                  "/images/practitioners/" +
                  p.name.split(" ")[0].toLowerCase() +
                  ".webp"
                }
                alt={"Illustrative portrait for " + p.name}
              />
              <small>Sample profile</small>
              <h3>{p.name}</h3>
              <p>{p.area}</p>
              <p>{p.about}</p>
              <details>
                <summary>Professional details</summary>
                <p>
                  Qualifications and registration are awaiting verification.
                  Sample availability is shown inside the booking demo.
                </p>
              </details>
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
                Active
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
            placeholder="Search demo clients"
          />
          <div className="panel">
            {Array.from(new Set(["Alex Demo", ...bookings.map((b) => b.name)]))
              .filter(matches)
              .map((n) => (
                <details key={n}>
                  <summary>{n}</summary>
                  <p>Sample client · Administrative record</p>
                  {bookings
                    .filter((b) => b.name === n)
                    .map((b) => (
                      <p key={b.id}>
                        {b.service} · {b.status}
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
            placeholder="Search requests by name or service"
          />
          <div className="panel">
            {bookings
              .filter((b) => matches(b.name + " " + b.service))
              .map((b) => (
                <details key={b.id}>
                  <summary>
                    {b.name} · {b.service} · {b.status}
                  </summary>
                  <p>
                    {b.slot} · {b.format}
                  </p>
                  <label className="field">
                    Status
                    <select
                      value={b.status}
                      onChange={(e) => change(b.id, { status: e.target.value })}
                    >
                      {["Requested", "Allocated", "Completed", "Cancelled"].map(
                        (s) => (
                          <option key={s}>{s}</option>
                        ),
                      )}
                    </select>
                  </label>
                  <label className="field">
                    Practitioner
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
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    Reschedule sample slot
                    <select
                      value={b.slot}
                      onChange={(e) => change(b.id, { slot: e.target.value })}
                    >
                      {Array.from(new Set([b.slot, ...sampleSlots()])).map(
                        (s) => (
                          <option key={s}>{s}</option>
                        ),
                      )}
                    </select>
                  </label>
                </details>
              ))}
            {!bookings.filter((b) => matches(b.name + " " + b.service))
              .length && (
              <p>
                No matching requests. Create one using the booking
                demonstration.
              </p>
            )}
            <div className="row">
              <Btn href="/booking">New sample request</Btn>
            </div>
          </div>
        </>
      )}
      {tab === "Schools" && (
        <div className="panel">
          <h2>Partnership and workshop enquiries</h2>
          {enquiries.map((en) => (
            <div key={en.id} className="list-item">
              <b>{en.organisation}</b>
              <p>
                {en.role} · {en.programme}
              </p>
              <label className="field">
                Request status
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
                      <option key={s}>{s}</option>
                    ),
                  )}
                </select>
              </label>
            </div>
          ))}
          {!enquiries.length && (
            <p>
              Sample enquiries from school, parent and corporate portals will
              appear here.
            </p>
          )}
        </div>
      )}
      {tab === "Assessments" && (
        <div className="panel">
          <span className="category">Demonstration only</span>
          <h2>Assessment administration</h2>
          <p>Sample allocation · Alex Demo · Practitioner-led review</p>
          <label className="field">
            Workflow status
            <select
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
            >
              {[
                "Awaiting practitioner review",
                "Allocated",
                "Review complete",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <details>
            <summary>Digital assessment workflow</summary>
            <p>
              Future workflow: practitioner selection, consent, authorised
              administration and practitioner review. Licensing and professional
              approval are required.
            </p>
          </details>
          <details>
            <summary>Practitioner-administered workflow</summary>
            <p>
              A qualified practitioner would schedule and administer an approved
              instrument, then review the restricted report.
            </p>
          </details>
        </div>
      )}
      {tab === "Reports" && (
        <div className="panel">
          <span className="category">Sample report · Completed</span>
          <h2>Practice activity summary</h2>
          <p>Administrative counts for this browser's demonstration records.</p>
          <div className="row">
            <button
              className="primary"
              onClick={async () => {
                await downloadPDF("Demo practice summary", [
                  {
                    title: "Demonstration practice summary",
                    text: counts.map(([n, t]) => t + ": " + n).join("\n"),
                  },
                ]);
                setNote("Sample report downloaded.");
              }}
            >
              Download sample report
            </button>
          </div>
          {note && <Notice>{note}</Notice>}
        </div>
      )}
      {tab === "Events" && (
        <div className="panel">
          <h2>Create a sample event</h2>
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
              Event name
              <input required name="title" maxLength={120} />
            </label>
            <label className="field">
              Event date
              <input required name="date" type="date" />
            </label>
            <button className="primary">Create event</button>
          </form>
          {events.map((v, i) => (
            <p key={i} className="list-item">
              {v.title} · {v.date}
            </p>
          ))}
          <A href="/events" className="ink-link">
            View public events
          </A>
          <h3>Sample registrations and attendance</h3>
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
                {event} · Attended
              </label>
            ))
          ) : (
            <p>Registrations from the events page appear here.</p>
          )}
        </div>
      )}
      {tab === "Services" && (
        <div className="panel">
          {services.map(([n, d]) => (
            <details key={n}>
              <summary>{n}</summary>
              <p>{d}</p>
              <small>Pricing · To be confirmed</small>
            </details>
          ))}
        </div>
      )}
      {tab === "Finance" && (
        <div className="panel">
          <span className="category">Sample invoice</span>
          <h2>School workshop</h2>
          <p>Illustrative invoice · DEMO-001</p>
          <label className="field">
            Payment status
            <select
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
            >
              <option>Pending</option>
              <option>Paid (demo)</option>
              <option>Cancelled</option>
            </select>
          </label>
          <p className="meta">Payment processing is deferred.</p>
        </div>
      )}
      {tab === "Settings" && (
        <div className="panel">
          <h2>Practice preferences</h2>
          <p>Letta Consulting · Practice team demo role</p>
          <label className="check">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({ notifications: e.target.checked })}
            />
            Show overview notification
          </label>
          <A href="/portal" className="ink-link">
            Switch demonstration role
          </A>
        </div>
      )}
      {tab === "Overview" && settings.notifications && (
        <Notice>
          Practice notifications ·{" "}
          {bookings.filter((b) => b.status === "Requested").length} appointment
          requests awaiting review.
        </Notice>
      )}
    </>
  );
}
