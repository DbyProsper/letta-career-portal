"use client";
import { slotLabel } from "../lib/slotLabel";
import { useState } from "react";
import {
  A,
  Btn,
  Cards,
  Notice,
  PageTitle,
  SearchField,
} from "../components/ui";
import { careers, opportunities, youthLinks, slug } from "../data/catalog";
import { Booking, Goal, toggle, useLocal } from "../lib/store";
import { useLanguage } from "../lib/language";
export const questions = [
  [
    "What would you like to spend an afternoon doing?",
    "Making something",
    "Solving a puzzle",
    "Helping someone",
    "Organising a project",
  ],
  [
    "Which strength would a friend recognise in you?",
    "Creativity",
    "Persistence",
    "Listening",
    "Planning",
  ],
  [
    "What matters most to you in a project?",
    "Learning something new",
    "Supporting a community",
    "Working independently",
    "Building something practical",
  ],
  [
    "Where would you like to try working?",
    "A studio",
    "A laboratory",
    "Outdoors",
    "A busy team space",
  ],
  [
    "How do you like to learn?",
    "Trying it myself",
    "Watching a demonstration",
    "Talking it through",
    "Reading and reflecting",
  ],
  [
    "Which subject would you explore further?",
    "Design",
    "Mathematics",
    "Life Sciences",
    "Languages",
  ],
  ["What is one small thing you would like to try next?"],
];
export function YouthDashboard() {
  const { t, locale } = useLanguage();
  const [saved] = useLocal<string[]>("savedCareers", []),
    [goals] = useLocal<Goal[]>("goals", []),
    [answers] = useLocal<string[]>("answers", []),
    [bookings] = useLocal<Booking[]>("bookings", []);
  return (
    <>
      <PageTitle
        group="Youth portal"
        title={t("Your discovery dashboard")}
        desc="Pick up where you left off, or explore something new."
      />
      <div className="metrics">
        {[
          [answers.filter(Boolean).length + "/7", "Discovery prompts"],
          [saved.length, "Saved careers"],
          [goals.length, "Personal goals"],
        ].map(([v, l]) => (
          <div className="metric" key={l}>
            <b>{v}</b>
            <span>{t(String(l))}</span>
          </div>
        ))}
      </div>
      <div className="panel">
        <h2>{t("Your next step")}</h2>
        <p>
          {t(
            answers.length === 7
              ? "Review your reflections and explore a career that interests you."
              : "Get to know your interests and strengths through seven short prompts.",
          )}
        </p>
        <div className="row">
          <Btn
            href={answers.length === 7 ? "/discover/results" : "/discover/me"}
          >
            {t(
              answers.length === 7
                ? "View reflections"
                : "Continue Discover Me",
            )}
          </Btn>
        </div>
      </div>
      <h2 className="section-title" style={{ marginTop: 25 }}>
        {t("Explore your workspace")}
      </h2>
      <Cards items={youthLinks.slice(2)} />
      <div className="panel">
        <h2>{t("Appointment requests")}</h2>
        {bookings.length ? (
          bookings.map((b) => (
            <p key={b.id}>
              {t(b.service)} · {slotLabel(b.slot, locale)} · {t(b.status)}
            </p>
          ))
        ) : (
          <p>{t("Your simulated appointment requests will appear here.")}</p>
        )}
        <A className="ink-link" href="/booking">
          {t("Request a session")}
        </A>
      </div>
    </>
  );
}
export function Discovery({ path }: { path: string }) {
  const [answers, setAnswers] = useLocal<string[]>("answers", []),
    [index, setIndex] = useLocal("questionIndex", 0),
    [mix] = useLocal<string[]>("mix", []);
  const { t } = useLanguage();
  const i = Math.min(index, questions.length - 1);
  const [prompt, ...choices] = questions[i];
  const value = answers[i] || "";
  function answer(v: string) {
    setAnswers((old) => {
      const next = [...old];
      next[i] = v;
      return next;
    });
  }
  if (path.endsWith("onboarding"))
    return (
      <>
        <PageTitle
          group="Discover Me"
          title={t("Start with yourself.")}
          desc="Explore the interests, strengths and values you want to bring into your future."
        />
        <div className="question">
          <h2>{t("Seven reflection prompts")}</h2>
          <p>
            {t(
              "Choose an answer in your own time. Your progress is saved in this browser. Use sample information for this demonstration.",
            )}
          </p>
          {mix.length > 0 && (
            <Notice>
              {t("Your Future Mix ·")} {mix.map((item) => t(item)).join(" + ")}
            </Notice>
          )}
          <p className="meta">
            {t(
              "Educational self-discovery activity. Results are suggestions for reflection.",
            )}
          </p>
          <div className="row">
            <Btn href="/discover/me">
              {t(answers.length ? "Continue activity" : "Start activity")}
            </Btn>
          </div>
        </div>
      </>
    );
  if (path.endsWith("results"))
    return (
      <>
        <PageTitle group="Discover Me" title={t("Your reflection map")} />
        {answers.filter((a) => a?.trim()).length < 7 ? (
          <div className="panel">
            <p>{t("Complete the seven prompts to see your reflection map.")}</p>
            <Btn href="/discover/me">{t("Continue activity")}</Btn>
          </div>
        ) : (
          <>
            <div className="panel">
              <span className="category">{t("Activity complete")}</span>
              <h2>
                {t("{strength} can guide your next step.", {
                  strength: t(answers[1]),
                })}
              </h2>
              <p>
                {t(
                  "You chose “{interest}” and “{value}”. Which careers could let you do both?",
                  { interest: t(answers[0]), value: t(answers[2]) },
                )}
              </p>
              <h3>{t("Your next experiment")}</h3>
              <p>{answers[6]}</p>
              <div className="row">
                <Btn href="/careers">{t("Explore Career World")}</Btn>
                <button
                  className="secondary"
                  onClick={() => {
                    setIndex(0);
                    location.assign("/discover/me/");
                  }}
                >
                  {t("Revisit answers")}
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  return (
    <>
      <PageTitle
        group="Discover Me"
        title={t("Explore what makes you, you.")}
      />
      <div className="question">
        <span className="meta">
          {t("Prompt")} {i + 1} {t("of")} {questions.length}
        </span>
        <div className="progress">
          <span style={{ width: ((i + 1) / questions.length) * 100 + "%" }} />
        </div>
        <h2>{t(prompt)}</h2>
        {choices.length ? (
          <div className="options">
            {choices.map((c) => (
              <button
                className="option"
                key={c}
                aria-pressed={value === c}
                onClick={() => answer(c)}
              >
                {t(c)}
              </button>
            ))}
          </div>
        ) : (
          <label className="field">
            {t("Your reflection")}
            <textarea
              value={value}
              maxLength={500}
              onChange={(e) => answer(e.target.value)}
              placeholder={t("I would like to try…")}
            />
          </label>
        )}
        <div className="pager">
          <button
            className="secondary"
            disabled={i === 0}
            onClick={() => setIndex(i - 1)}
          >
            {t("Back")}
          </button>
          <A className="ink-link" href="/discover">
            {t("Save and leave")}
          </A>
          <button
            className="primary"
            disabled={!value.trim()}
            onClick={() =>
              i === 6 ? location.assign("/discover/results/") : setIndex(i + 1)
            }
          >
            {t(i === 6 ? "View reflections" : t("Next"))}
          </button>
        </div>
      </div>
    </>
  );
}
export function CareerWorld({ path }: { path: string }) {
  const { t } = useLanguage();
  const [query, search] = useState(""),
    [cat, filter] = useState("All fields"),
    [sort, order] = useState("A–Z"),
    [favorites, fav] = useState(false),
    [saved, save] = useLocal<string[]>("savedCareers", []),
    [compare, setCompare] = useLocal<string[]>("compareCareers", []);
  const career = careers.find((c) => path === "/careers/" + c.id);
  const [studyIdeas, setStudyIdeas] = useLocal<string[]>("studyIdeas", []);
  function controls(id: string) {
    return (
      <div className="row">
        <button
          className="chip"
          aria-pressed={saved.includes(id)}
          onClick={() => save((old) => toggle(old, id))}
        >
          {t(saved.includes(id) ? "Saved career" : "Save career")}
        </button>
        <button
          className="chip"
          disabled={!compare.includes(id) && compare.length >= 3}
          aria-pressed={compare.includes(id)}
          onClick={() => setCompare((old) => toggle(old, id))}
        >
          {t(compare.includes(id) ? "Remove from comparison" : "Compare")}
        </button>
      </div>
    );
  }
  if (career)
    return (
      <>
        <A className="ink-link" href="/careers">
          {t("All careers")}
        </A>
        <PageTitle
          group={career.category}
          title={t(career.name)}
          desc={career.summary}
        />
        {controls(career.id)}
        <div className="panel">
          {[
            ["Skills to explore", career.skills],
            ["Suggested subjects", career.subjects],
            ["Possible study pathways", career.study],
            ["Try it for yourself", career.activity],
          ].map(([label, d]) => (
            <div className="list-item" key={label}>
              <h3>{t(label)}</h3>
              <p>{t(d)}</p>
            </div>
          ))}
          <p className="meta">
            {t(
              "Illustrative career information. Check current programme and admission requirements directly with each institution.",
            )}
          </p>
          <details>
            <summary>{t("Plan your study research")}</summary>
            <p>
              {t(
                "Check each prospectus for subject requirements, application dates, fees and alternative entry routes. Compare university, university of technology and vocational options.",
              )}
            </p>
            {[
              "University of Pretoria",
              "Tshwane University of Technology",
              "Tshwane North TVET College",
            ].map((name) => (
              <div className="list-item" key={name}>
                <b>{name}</b>
                <div className="row">
                  <button
                    className="chip"
                    aria-pressed={studyIdeas.includes(name)}
                    onClick={() => setStudyIdeas((old) => toggle(old, name))}
                  >
                    {t(
                      studyIdeas.includes(name)
                        ? "Saved to My Future"
                        : "Save institution to research",
                    )}
                  </button>
                </div>
              </div>
            ))}
          </details>
        </div>
      </>
    );
  const list = careers
    .filter(
      (c) =>
        (cat === "All fields" || c.category === cat) &&
        (!favorites || saved.includes(c.id)) &&
        [c.name, c.category, c.skills, t(c.name), t(c.category), t(c.skills)]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "A–Z"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    );
  return (
    <>
      <PageTitle
        group="Career discovery"
        title={t("Career World")}
        desc="Search career fields, save possibilities and compare up to three side by side."
      />
      <SearchField
        value={query}
        set={search}
        placeholder={t("Search careers or skills")}
      />
      <div className="row">
        <select
          aria-label={t("Career field")}
          value={cat}
          onChange={(e) => filter(e.target.value)}
        >
          {["All fields", ...careers.map((c) => c.category)].map((x) => (
            <option key={x} value={x}>
              {t(x)}
            </option>
          ))}
        </select>
        <select
          aria-label={t("Sort careers")}
          value={sort}
          onChange={(e) => order(e.target.value)}
        >
          <option value="A–Z">{t("A–Z")}</option>
          <option value="Z–A">{t("Z–A")}</option>
        </select>
        <button
          className="chip"
          aria-pressed={favorites}
          onClick={() => fav(!favorites)}
        >
          {t("Saved (")}
          {saved.length})
        </button>
      </div>
      {compare.length > 0 && (
        <div className="panel">
          <h2>{t("Career comparison")}</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{t("Career")}</th>
                  <th>{t("Subjects")}</th>
                  <th>{t("Pathway")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {careers
                  .filter((c) => compare.includes(c.id))
                  .map((c) => (
                    <tr key={c.id}>
                      <th>{t(c.name)}</th>
                      <td>{t(c.subjects)}</td>
                      <td>{t(c.study)}</td>
                      <td>
                        <button
                          aria-label={t("Remove {career}", {
                            career: t(c.name),
                          })}
                          onClick={() => setCompare((old) => toggle(old, c.id))}
                        >
                          {t("Remove")}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="tiles">
        {list.map((c) => (
          <div className="panel career-tile" key={c.id}>
            <img
              className="career-photo"
              src={"/images/careers/" + slug(c.category) + ".webp"}
              alt=""
              loading="lazy"
            />
            <span className="category">{t(c.category)}</span>
            <h3>
              <A className="ink-link" href={"/careers/" + c.id}>
                {t(c.name)}
              </A>
            </h3>
            <p>{t(c.summary)}</p>
            {controls(c.id)}
          </div>
        ))}
      </div>
      {!list.length && (
        <p className="empty">{t("No careers match these filters.")}</p>
      )}
    </>
  );
}
export function MyFuture() {
  const { t } = useLanguage();
  const [goals, set] = useLocal<Goal[]>("goals", []),
    [saved] = useLocal<string[]>("savedCareers", []),
    [study, setStudy] = useLocal<string[]>("studyIdeas", []);
  return (
    <>
      <PageTitle
        group="Personal roadmap"
        title={t("My Future")}
        desc="Give a goal a first milestone and track each step you complete."
      />
      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault();
          const f = e.currentTarget;
          const title = String(new FormData(f).get("goal")).trim();
          if (title) {
            set((old) => [
              ...old,
              { id: crypto.randomUUID(), title, milestones: [] },
            ]);
            f.reset();
          }
        }}
      >
        <label className="field">
          {t("New goal")}
          <input
            required
            pattern=".*\S.*"
            name="goal"
            maxLength={150}
            placeholder={t("Explore a design qualification")}
          />
        </label>
        <button className="primary">{t("Add goal")}</button>
      </form>
      <div className="roadmap">
        {goals.map((g) => {
          const done = g.milestones.filter((m) => m.done).length;
          return (
            <div className="panel" key={g.id}>
              <h3>{g.title}</h3>
              <p>
                {done} {t("of")} {g.milestones.length}{" "}
                {t("milestones complete")}
              </p>
              <div className="progress">
                <span
                  style={{
                    width:
                      (done / Math.max(1, g.milestones.length)) * 100 + "%",
                  }}
                />
              </div>
              {g.milestones.map((m) => (
                <label className="check" key={m.id}>
                  <input
                    type="checkbox"
                    checked={m.done}
                    onChange={() =>
                      set((old) =>
                        old.map((goal) =>
                          goal.id === g.id
                            ? {
                                ...goal,
                                milestones: goal.milestones.map((s) =>
                                  s.id === m.id ? { ...s, done: !s.done } : s,
                                ),
                              }
                            : goal,
                        ),
                      )
                    }
                  />
                  {m.title}
                </label>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = e.currentTarget;
                  const title = String(new FormData(f).get("milestone")).trim();
                  if (title) {
                    set((old) =>
                      old.map((goal) =>
                        goal.id === g.id
                          ? {
                              ...goal,
                              milestones: [
                                ...goal.milestones,
                                { id: crypto.randomUUID(), title, done: false },
                              ],
                            }
                          : goal,
                      ),
                    );
                    f.reset();
                  }
                }}
              >
                <label className="field">
                  {t("New milestone")}
                  <input required name="milestone" maxLength={140} />
                </label>
                <button className="secondary">{t("Add milestone")}</button>
              </form>
            </div>
          );
        })}
      </div>
      <div className="panel">
        <h2>{t("Saved careers and study ideas")}</h2>
        {careers
          .filter((c) => saved.includes(c.id))
          .map((c) => (
            <p key={c.id}>
              <A className="ink-link" href={"/careers/" + c.id}>
                {t(c.name)}
              </A>
            </p>
          ))}
        {study.map((s) => (
          <p key={s}>{t(s)}</p>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = e.currentTarget;
            const s = String(new FormData(f).get("idea")).trim();
            if (s && !study.includes(s)) setStudy([...study, s]);
            f.reset();
          }}
        >
          <label className="field">
            {t("Institution or qualification")}
            <input required name="idea" maxLength={120} />
          </label>
          <button className="secondary">{t("Save study idea")}</button>
        </form>
      </div>
    </>
  );
}
export function Games() {
  const { t } = useLanguage();
  const deck = [careers[0], careers[3], careers[5], careers[6], careers[9]];
  const [level, setLevel] = useState(0),
    [score, setScore] = useState(0),
    [picked, setPicked] = useState("");
  const item = deck[level];
  return (
    <>
      <PageTitle
        group="Future Games"
        title={t("Career Match Challenge")}
        desc="Match each everyday task to a career. Play five rounds to earn your explorer badge."
      />
      <div className="question">
        {item ? (
          <>
            <span className="category">
              {t("Round")} {level + 1} {t("/ 5 · Score")} {score}
            </span>
            <h2>{t(item.summary)}</h2>
            <div className="options">
              {[item, deck[(level + 2) % 5], deck[(level + 3) % 5]]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((c) => (
                  <button
                    key={c.id}
                    className="option"
                    disabled={!!picked}
                    onClick={() => {
                      setPicked(c.name);
                      if (c.id === item.id) setScore(score + 1);
                    }}
                  >
                    {t(c.name)}
                  </button>
                ))}
            </div>
            {picked && (
              <>
                <Notice>
                  {picked === item.name
                    ? t("Correct!")
                    : t("This task matches this career: {career}.", {
                        career: t(item.name),
                      })}
                </Notice>
                <button
                  className="primary"
                  onClick={() => {
                    setLevel(level + 1);
                    setPicked("");
                  }}
                >
                  {t(level === 4 ? "Finish game" : "Next round")}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <span className="category">{t("Explorer badge earned")}</span>
            <h2>
              {t("You matched")} {score} {t("of 5 careers.")}
            </h2>
            <button
              className="primary"
              onClick={() => {
                setLevel(0);
                setPicked("");
                setScore(0);
              }}
            >
              {t("Play again")}
            </button>
          </>
        )}
      </div>
    </>
  );
}
export function Opportunities() {
  const { t } = useLanguage();
  const [saved, set] = useLocal<string[]>("savedOpps", []),
    [filter, setFilter] = useState("All");
  return (
    <>
      <PageTitle
        group="Career discovery"
        title={t("Opportunity Hub")}
        desc="Explore sample funding, training and work opportunities."
      />
      <Notice>
        {t(
          "Demonstration listings · Applications are closed in this prototype.",
        )}
      </Notice>
      <div className="chips">
        {["All", "Saved"].map((s) => (
          <button
            key={s}
            className="chip"
            aria-pressed={filter === s}
            onClick={() => setFilter(s)}
          >
            {t(s)}
          </button>
        ))}
      </div>
      <div className="tiles">
        {opportunities
          .filter((o) => filter === "All" || saved.includes(o[1]))
          .map(([cat, n, d]) => (
            <div className="panel" key={n}>
              <span className="category">{t(cat)}</span>
              <h3>{t(n)}</h3>
              <p>{t(d)}</p>
              <p className="meta">
                {t("Illustrative closing date · 30 April 2027")}
              </p>
              <button
                className="secondary"
                onClick={() => set((old) => toggle(old, n))}
              >
                {t(saved.includes(n) ? "Remove saved" : "Save opportunity")}
              </button>
            </div>
          ))}
      </div>
      {filter === "Saved" && !saved.length && (
        <p className="empty">{t("Save a listing to see it here.")}</p>
      )}
    </>
  );
}
