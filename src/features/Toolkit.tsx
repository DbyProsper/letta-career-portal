"use client";
import { useLanguage } from "../lib/language";
import { useState } from "react";
import { Cards, PageTitle, Notice } from "../components/ui";
import { useLocal } from "../lib/store";
type Section = { title: string; text: string };
const defaults = [
  "Profile",
  "Education",
  "Qualifications",
  "Skills",
  "Work experience",
  "Volunteer experience",
  "Projects",
  "Achievements",
  "References",
].map((title) => ({ title, text: "" }));
export async function downloadPDF(
  name: string,
  blocks: Section[],
  style = "Classic",
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  let y = 24;
  const margin = 19;
  const width = 171;
  doc.setFillColor(
    style === "Modern"
      ? "#00756d"
      : style === "Editorial"
        ? "#cfad69"
        : "#172f38",
  );
  doc.rect(0, 0, 210, 5, "F");
  for (const { title, text } of blocks) {
    if (!text.trim()) continue;
    if (y > 245) {
      doc.addPage();
      y = 22;
    }
    doc.setFont(style === "Editorial" ? "times" : "helvetica", "bold");
    doc.setFontSize(13);
    doc.text(title, margin, y);
    y += 8;
    doc.setFont(style === "Classic" ? "times" : "helvetica", "normal");
    doc.setFontSize(11);
    for (const line of doc.splitTextToSize(text, width) as string[]) {
      if (y > 277) {
        doc.addPage();
        y = 22;
      }
      doc.text(line, margin, y);
      y += 5.5;
    }
    y += 8;
  }
  doc.save(name + ".pdf");
}
export function Toolkit({ path }: { path: string }) {
  const { t } = useLanguage();
  if (path.endsWith("cv-builder")) return <CV />;
  if (path.endsWith("cover-letter-builder")) return <Letter />;
  return (
    <>
      <PageTitle
        group="Practical tools"
        title={t("Career Toolkit")}
        desc="Prepare application documents with sample details. Drafts stay in this browser."
      />
      <Cards
        items={[
          [
            "CV Builder",
            "/career-toolkit/cv-builder",
            "Build and preview a CV, then export a PDF.",
          ],
          [
            "Cover Letter Builder",
            "/career-toolkit/cover-letter-builder",
            "Draft a letter for an opportunity and make it your own.",
          ],
        ]}
      />
    </>
  );
}
function CV() {
  const { t } = useLanguage();
  const [name, setName] = useLocal("cvName", ""),
    [email, setEmail] = useLocal("cvEmail", ""),
    [template, setTemplate] = useLocal("cvStyle", "Modern"),
    [sections, setSections] = useLocal<Section[]>("cvSections", defaults),
    [status, setStatus] = useState("");
  function move(i: number, by: number) {
    const next = [...sections];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    setSections(next);
  }
  return (
    <>
      <PageTitle
        group="Career Toolkit"
        title={t("CV Builder")}
        desc="Use fictional details to build your CV. Your preview updates as you type."
      />
      <div className="split">
        <form
          className="panel"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await downloadPDF(
                "Sample CV",
                [
                  { title: name, text: email },
                  ...sections.map((section) => ({
                    ...section,
                    title: t(section.title),
                  })),
                ],
                template,
              );
              setStatus("CV PDF exported.");
            } catch {
              setStatus("PDF export failed. Please try again.");
            }
          }}
        >
          <label className="field">
            {t("Full name")}
            <input
              required
              pattern=".*\S.*"
              maxLength={90}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="field">
            {t("Email")}
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="field">
            {t("CV template")}
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              {["Modern", "Classic", "Editorial"].map((s) => (
                <option key={s} value={s}>
                  {t(s)}
                </option>
              ))}
            </select>
          </label>
          {sections.map((s, i) => (
            <details key={s.title} open={i === 0 || undefined}>
              <summary>{t(s.title)}</summary>
              <label className="field">
                {t(s.title)} {t("details")}
                <textarea
                  maxLength={2500}
                  value={s.text}
                  onChange={(e) =>
                    setSections(
                      sections.map((n, j) =>
                        i === j ? { ...n, text: e.target.value } : n,
                      ),
                    )
                  }
                />
              </label>
              <div className="row">
                <button
                  type="button"
                  className="secondary"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  {t("Move up")}
                </button>
                <button
                  type="button"
                  className="secondary"
                  disabled={i === sections.length - 1}
                  onClick={() => move(i, 1)}
                >
                  {t("Move down")}
                </button>
              </div>
            </details>
          ))}
          <div className="row">
            <button className="primary">{t("Export CV as PDF")}</button>
          </div>
          {status && <Notice>{t(status)}</Notice>}
        </form>
        <article
          className={"paper " + template.toLowerCase()}
          aria-label={t("Live CV preview")}
        >
          <span className="category">
            {t(template)} {t("preview")}
          </span>
          <h2>{name || t("Your name")}</h2>
          <p>{email || t("Your email address")}</p>
          {sections
            .filter((s) => s.text)
            .map((s) => (
              <div key={s.title}>
                <h3>{t(s.title)}</h3>
                <p>{s.text}</p>
              </div>
            ))}
        </article>
      </div>
    </>
  );
}
function Letter() {
  const { t } = useLanguage();
  const [form, setForm] = useLocal("letterForm", {
      type: "Employment",
      company: "",
      position: "",
      experience: "",
      name: "",
    }),
    [draft, setDraft] = useLocal("letterDraft", ""),
    [status, setStatus] = useState("");
  return (
    <>
      <PageTitle
        group="Career Toolkit"
        title={t("Cover Letter Builder")}
        desc="Generate a first draft, edit the wording and export a PDF."
      />
      <div className="split">
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            setDraft(
              [
                t("Dear {company} team,", { company: form.company.trim() }),
                t("I am applying for {position} ({type}).", {
                  position: form.position.trim(),
                  type: t(form.type),
                }),
                form.experience.trim(),
                t(
                  "I would welcome the opportunity to discuss how I could contribute. Thank you for considering my application.",
                ),
                t("Kind regards,") + "\n" + form.name.trim(),
              ].join("\n\n"),
            );
            setStatus("Draft generated. Edit the preview before exporting.");
          }}
        >
          <label className="field">
            {t("Application type")}
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {[
                "Employment",
                "Graduate programme",
                "Internship",
                "Learnership",
                "Scholarship or bursary",
              ].map((v) => (
                <option key={v} value={v}>
                  {t(v)}
                </option>
              ))}
            </select>
          </label>
          {(
            [
              ["name", "Your name"],
              ["company", "Organisation"],
              ["position", "Position or programme"],
              ["experience", "Relevant experience"],
            ] as const
          ).map(([k, l]) => (
            <label className="field" key={k}>
              {t(l)}
              <input
                required
                pattern=".*\S.*"
                maxLength={600}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            </label>
          ))}
          <button className="primary">
            {t(draft ? "Regenerate draft" : "Generate draft")}
          </button>
        </form>
        <div className="paper">
          <h2>{t("Letter preview")}</h2>
          <label className="field">
            {t("Editable draft")}
            <textarea
              rows={13}
              value={draft}
              placeholder={t("Your draft will appear here.")}
              onChange={(e) => setDraft(e.target.value)}
            />
          </label>
          <button
            className="secondary"
            disabled={!draft.trim()}
            onClick={async () => {
              try {
                await downloadPDF("Sample cover letter", [
                  { title: t("Cover letter"), text: draft },
                ]);
                setStatus("Letter PDF exported.");
              } catch {
                setStatus("PDF export failed. Please try again.");
              }
            }}
          >
            {t("Export letter as PDF")}
          </button>
        </div>
      </div>
      {status && <Notice>{t(status)}</Notice>}
    </>
  );
}
