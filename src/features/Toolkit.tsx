"use client";
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
  if (path.endsWith("cv-builder")) return <CV />;
  if (path.endsWith("cover-letter-builder")) return <Letter />;
  return (
    <>
      <PageTitle
        group="Practical tools"
        title="Career Toolkit"
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
        title="CV Builder"
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
                [{ title: name, text: email }, ...sections],
                template,
              );
              setStatus("CV PDF exported.");
            } catch {
              setStatus("PDF export failed. Please try again.");
            }
          }}
        >
          <label className="field">
            Full name
            <input
              required
              pattern=".*\S.*"
              maxLength={90}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="field">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="field">
            CV template
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              {["Modern", "Classic", "Editorial"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          {sections.map((s, i) => (
            <details key={s.title} open={i === 0 || undefined}>
              <summary>{s.title}</summary>
              <label className="field">
                {s.title} details
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
                  Move up
                </button>
                <button
                  type="button"
                  className="secondary"
                  disabled={i === sections.length - 1}
                  onClick={() => move(i, 1)}
                >
                  Move down
                </button>
              </div>
            </details>
          ))}
          <div className="row">
            <button className="primary">Export CV as PDF</button>
          </div>
          {status && <Notice>{status}</Notice>}
        </form>
        <article
          className={"paper " + template.toLowerCase()}
          aria-label="Live CV preview"
        >
          <span className="category">{template} preview</span>
          <h2>{name || "Your name"}</h2>
          <p>{email || "Your email address"}</p>
          {sections
            .filter((s) => s.text)
            .map((s) => (
              <div key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
        </article>
      </div>
    </>
  );
}
function Letter() {
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
        title="Cover Letter Builder"
        desc="Generate a first draft, edit the wording and export a PDF."
      />
      <div className="split">
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            setDraft(
              "Dear " +
                form.company.trim() +
                " team,\n\nI am writing to apply for " +
                form.position.trim() +
                " as a " +
                form.type.toLowerCase() +
                " opportunity.\n\n" +
                form.experience.trim() +
                "\n\nI would welcome the opportunity to discuss how I could contribute. Thank you for considering my application.\n\nKind regards,\n" +
                form.name.trim(),
            );
            setStatus("Draft generated. Edit the preview before exporting.");
          }}
        >
          <label className="field">
            Application type
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
                <option key={v}>{v}</option>
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
              {l}
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
            {draft ? "Regenerate draft" : "Generate draft"}
          </button>
        </form>
        <div className="paper">
          <h2>Letter preview</h2>
          <label className="field">
            Editable draft
            <textarea
              rows={13}
              value={draft}
              placeholder="Your draft will appear here."
              onChange={(e) => setDraft(e.target.value)}
            />
          </label>
          <button
            className="secondary"
            disabled={!draft.trim()}
            onClick={async () => {
              try {
                await downloadPDF("Sample cover letter", [
                  { title: "Cover letter", text: draft },
                ]);
                setStatus("Letter PDF exported.");
              } catch {
                setStatus("PDF export failed. Please try again.");
              }
            }}
          >
            Export letter as PDF
          </button>
        </div>
      </div>
      {status && <Notice>{status}</Notice>}
    </>
  );
}
