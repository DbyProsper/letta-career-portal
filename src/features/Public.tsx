"use client";
import { useLanguage } from "../lib/language";
import { useEffect, useState } from "react";
import {
  A,
  Btn,
  Cards,
  Notice,
  PageTitle,
  SearchField,
} from "../components/ui";
import { practitioners, resources, services, slug } from "../data/catalog";
import { Article, toggle, useLocal } from "../lib/store";
export function Library({ wellness = false }: { wellness?: boolean }) {
  const { t, language } = useLanguage();
  const [articles] = useLocal<Article[]>("articles", []),
    [q, setQ] = useState(""),
    [category, setCategory] = useState("All"),
    [saved, setSaved] = useLocal<string[]>("savedResources", []);
  const list = [
    ...resources.map(([category, title, body]) => ({
      id: title,
      image: "",
      title,
      category,
      body,
      language: "English",
      original: true,
    })),
    ...articles
      .map((a) => ({ ...a, original: false }))
      .filter((a) => a.published && (!wellness || a.category === "Wellness")),
  ];
  const filtered = list.filter(
    (a) =>
      (category === "All" ||
        (category === "Saved"
          ? saved.includes(a.id)
          : a.category === category)) &&
      [a.title, a.category, t(a.title), t(a.category)]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  return (
    <>
      <PageTitle
        group={wellness ? "Wellbeing" : "Letta Consulting"}
        title={t(wellness ? "Wellness Space" : "Resource library")}
        desc={
          wellness
            ? "Take a moment for yourself with short educational reflections and exercises."
            : "Browse short reads, activities and resources published in this demo."
        }
      />
      <SearchField value={q} set={setQ} placeholder={t("Search resources")} />
      <div className="row">
        <select
          aria-label={t("Resource category")}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {Array.from(
            new Set(["All", "Saved", ...list.map((a) => a.category)]),
          ).map((c) => (
            <option key={c} value={c}>
              {t(c)}
            </option>
          ))}
        </select>
      </div>
      <div className="panel">
        {filtered.map((a) => (
          <details key={a.id}>
            <summary>{a.original ? t(a.title) : a.title}</summary>
            {a.image && (
              <img
                className="article-image"
                src={"/images/path-" + a.image + ".webp"}
                alt=""
              />
            )}
            <span className="category">
              {t(a.category)} · {a.original ? language : a.language}
            </span>
            <p>{a.original ? t(a.body) : a.body}</p>
            <div className="row">
              <button
                className="secondary"
                onClick={() => setSaved((old) => toggle(old, a.id))}
              >
                {t(
                  saved.includes(a.id)
                    ? "Remove saved resource"
                    : "Save resource",
                )}
              </button>
            </div>
          </details>
        ))}
        {!filtered.length && <p>{t("No matching resources.")}</p>}
      </div>
      {wellness && (
        <div className="panel">
          <h2>{t("Looking for personal guidance?")}</h2>
          <p>
            {t(
              "These activities are for general education. Explore the practice's services to discuss individual support.",
            )}
          </p>
          <div className="row">
            <Btn href="/services">{t("Explore support")}</Btn>
          </div>
        </div>
      )}
    </>
  );
}
export function Services({ path }: { path: string }) {
  const { t } = useLanguage();
  const s = services.find((x) => path.endsWith("/" + slug(x[0])));
  return s ? (
    <>
      <A className="ink-link" href="/services">
        {t("All services")}
      </A>
      <PageTitle group="Professional support" title={t(s[0])} desc={s[1]} />
      <div className="panel form-panel">
        <h2>{t("Arrange a conversation")}</h2>
        <p>
          {t(
            "Walk through choosing a service, a sample practitioner and a time in the booking demonstration. For a real enquiry, contact Letta Consulting directly.",
          )}
        </p>
        <div className="row">
          <Btn href={"/booking?service=" + encodeURIComponent(s[0])}>
            {t("Try the booking demo")}
          </Btn>
          <Btn light href="/contact">
            {t("Contact the practice")}
          </Btn>
        </div>
      </div>
    </>
  ) : (
    <>
      <PageTitle
        group="Letta Consulting"
        title={t("Our services")}
        desc="Find career guidance, psychological wellness and professional support."
      />
      <Cards items={services.map(([n, d]) => [n, "/services/" + slug(n), d])} />
    </>
  );
}
export function Team() {
  const { t } = useLanguage();
  const [i, setI] = useState(-1);
  useEffect(() => {
    const p = new URLSearchParams(location.search).get("profile");
    if (p !== null && ["0", "1", "2"].includes(p)) setI(Number(p));
  }, []);
  return (
    <>
      <PageTitle
        group="Professional support"
        title={t("Meet the demo team")}
        desc="Sample profiles illustrate how you could choose a practitioner."
      />
      <div className="tiles">
        {practitioners.map((p, j) => (
          <div className="panel" key={p.name}>
            <img
              className="practitioner-photo"
              src={
                "/images/practitioners/" +
                p.name.split(" ")[0].toLowerCase() +
                ".webp"
              }
              alt={t("Illustrative portrait for {name}", { name: p.name })}
            />
            <small>{t("Sample practitioner")}</small>
            <h3>{p.name}</h3>
            <p>{t(p.area)}</p>
            <div className="row">
              <button
                aria-expanded={j === i}
                className="secondary"
                onClick={() => setI(i === j ? -1 : j)}
              >
                {t(i === j ? "Close profile" : "View profile")}
              </button>
            </div>
            {i === j && (
              <>
                <p>{t(p.about)}</p>
                <div className="row">
                  <Btn
                    href={"/booking?practitioner=" + encodeURIComponent(p.name)}
                  >
                    {t("Request a session")}
                  </Btn>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
export function Events() {
  const { t } = useLanguage();
  const [events] = useLocal<{ title: string; date: string }[]>("events", []),
    [registered, setRegistered] = useLocal<string[]>("eventRegistrations", []);
  return (
    <>
      <PageTitle
        group="Resources"
        title={t("Events and workshops")}
        desc="Explore example sessions and save a demonstration registration."
      />
      <div className="tiles">
        {[
          { title: "Career Discovery Day", date: "2027-02-19" },
          { title: "Study-life balance workshop", date: "2027-03-05" },
          ...events,
        ].map((v, i) => {
          const id = v.title + " " + v.date;
          return (
            <div className="panel" key={i}>
              <span className="category">{t("Sample event")}</span>
              <h3>{t(v.title)}</h3>
              <p>{t(v.date)}</p>
              <div className="row">
                <button
                  className="secondary"
                  onClick={() => setRegistered((old) => toggle(old, id))}
                >
                  {t(
                    registered.includes(id)
                      ? "Cancel demo registration"
                      : "Register in demo",
                  )}
                </button>
              </div>
              {registered.includes(id) && (
                <Notice>{t("Demo registration saved.")}</Notice>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
export function Info({ path }: { path: string }) {
  const { t } = useLanguage();
  if (path === "/about")
    return (
      <>
        <PageTitle
          group="About the practice"
          title={t("About Letta Consulting")}
          desc="Psychological, health and medico-legal services for individuals and organisations."
        />
        <div className="long-copy">
          <p>
            {t(
              "Led by clinical psychologist Letta, the practice draws on experience in private practice and corporate settings dating back to 2006. Its work includes psychological therapy, employee support, training and medico-legal services.",
            )}
          </p>
          <p>
            {t(
              "This career and wellness portal demonstrates how those services could connect with career exploration and practical planning tools.",
            )}
          </p>
          <div className="row">
            <Btn href="/services">{t("Explore services")}</Btn>
            <a className="ink-link" href="https://lettaconsulting.co.za/">
              {t("Visit the official website")}
            </a>
          </div>
        </div>
      </>
    );
  if (path === "/contact")
    return (
      <>
        <PageTitle
          group="Letta Consulting"
          title={t("Contact the practice")}
          desc="For real appointments and business enquiries, use the practice's published contact details."
        />
        <div className="panel form-panel">
          <h3>{t("Email")}</h3>
          <a className="ink-link" href="mailto:info@lettaconsulting.co.za">
            info@lettaconsulting.co.za
          </a>
          <h3>{t("Telephone")}</h3>
          <a className="ink-link" href="tel:+27120042803">
            +27 12 004 2803
          </a>
          <h3>{t("Address")}</h3>
          <p>873 Stanza Bopape & Eastwood Street, Arcadia 0183</p>
          <div className="row">
            <a className="ink-link" href="https://lettaconsulting.co.za/">
              {t("Official Letta Consulting website")}
            </a>
          </div>
        </div>
      </>
    );
  const privacy = path === "/privacy";
  return (
    <>
      <PageTitle
        group="Prototype information"
        title={t(privacy ? "Privacy in this demo" : "Terms of this demo")}
      />
      <div className="long-copy">
        <p>
          {t(
            privacy
              ? "Demo entries are stored in this browser on this device. Anyone using the same browser profile can switch between demo roles and see those entries. Use fictional names and sample information. Clear this site's browser data to remove local entries."
              : "This interactive prototype demonstrates possible services and workflows. Bookings, registrations, opportunities and practitioner profiles marked as samples are illustrative. Contact the practice directly to arrange real services.",
          )}
        </p>
        <p>
          {t(
            "Discovery activities offer educational reflection prompts. Professional assessment, clinical records and payment processing are reserved for a future reviewed system.",
          )}
        </p>
        <A href="/contact" className="ink-link">
          {t("Contact Letta Consulting")}
        </A>
      </div>
    </>
  );
}
