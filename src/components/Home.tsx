"use client";
import { PractitionerIdentity } from "./PractitionerIdentity";
import { HomeReveals, RevealWords } from "./HomeReveals";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Compass,
  Fingerprint,
  Flower2,
  GraduationCap,
  Hand,
  Heart,
  MoveUpRight,
  Orbit,
  Pause,
  Play,
  Sparkles,
  Star,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";
import { A, Btn, Cards } from "./ui";
import { useLanguage } from "../lib/language";
import { toggle, useLocal } from "../lib/store";
import { practitioners } from "../data/catalog";
const dimensions = [
  {
    name: "My interests",
    icon: Sparkles,
    prompt: "What energises you?",
    text: "Explore what sparks your curiosity.",
  },
  {
    name: "My strengths",
    icon: ChartNoAxesColumnIncreasing,
    prompt: "What comes naturally?",
    text: "Notice what comes naturally to you.",
  },
  {
    name: "My wellbeing",
    icon: Heart,
    prompt: "How do you want to feel?",
    text: "Make room for what helps you feel grounded.",
  },
  {
    name: "My ambitions",
    icon: GraduationCap,
    prompt: "Where could you go?",
    text: "Imagine a goal you would like to work towards.",
  },
];
const paths = [
  {
    n: "Career guidance and counselling",
    d: "Talk through subject choices, study options and your next career step with a counsellor.",
    href: "/services/career-guidance-and-counselling",
    icon: Compass,
    img: "career",
    className: "career",
  },
  {
    n: "Psychological wellness",
    d: "Make space for your wellbeing.",
    href: "/wellness",
    icon: Heart,
    img: "wellness",
    className: "wellness",
  },
  {
    n: "Professional support",
    d: "Connect with guidance for your next step.",
    href: "/services",
    icon: BriefcaseBusiness,
    img: "support",
    className: "professional",
  },
];
function FutureMix() {
  const { t } = useLanguage();
  const [selected, set] = useLocal<string[]>("mix", []),
    [hint, show] = useState("");
  const [paused, setPaused] = useState(false);
  const center = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const reduced = useReducedMotion();
  function choose(i: number) {
    const n = dimensions[i];
    set((old) => toggle(old, n.name));
    show(selected.includes(n.name) ? "" : n.text);
  }
  return (
    <div
      className="hero-art"
      id="future-mix"
      data-mixed={selected.length > 0}
      data-paused={paused}
    >
      <div className="art-halo" />
      <div className="orbit-line one" />
      <div className="orbit-line two" />
      <div className="dot-matrix" />
      <div className="art-star s1" aria-hidden="true">
        ✳
      </div>
      <div className="art-star s2" aria-hidden="true">
        ✦
      </div>
      <div className="art-ring" aria-hidden="true" />
      <div className="art-pearl" aria-hidden="true" />
      <img
        className="hero-person"
        alt={t("Smiling young woman looking ahead")}
        src="/images/hero-discovery.webp"
      />
      <div
        className="mix-target"
        ref={center}
        aria-label={t("Drop a dimension here")}
      >
        <Orbit size={19} />
        <span>{t("Your next chapter")}</span>
        {selected.length > 0 && <b>{selected.length}/4</b>}
      </div>
      {dimensions.map(({ name, prompt, icon: Icon }, i) => (
        <motion.button
          key={name}
          className={
            "orb orb-" + i + (selected.includes(name) ? " selected" : "")
          }
          aria-pressed={selected.includes(name)}
          aria-label={t(name)}
          aria-describedby={"mix-prompt-" + i}
          drag
          dragSnapToOrigin
          dragMomentum={false}
          onDragStart={() => {
            dragged.current = true;
          }}
          onDragEnd={(_, info) => {
            const rect = center.current?.getBoundingClientRect();
            if (
              rect &&
              info.point.x >= rect.left + scrollX - 28 &&
              info.point.x <= rect.right + scrollX + 28 &&
              info.point.y >= rect.top + scrollY - 28 &&
              info.point.y <= rect.bottom + scrollY + 28
            )
              choose(i);
            setTimeout(() => {
              dragged.current = false;
            }, 80);
          }}
          onClick={() => {
            if (!dragged.current) choose(i);
          }}
          whileHover={reduced ? {} : { scale: 1.045 }}
          whileDrag={{ scale: 1.07, zIndex: 8 }}
        >
          <span className="orb-face">
            <Icon size={23} aria-hidden="true" />
            <strong>{t(name)}</strong>
            <small id={"mix-prompt-" + i}>{t(prompt)}</small>
            {selected.includes(name) && (
              <Check className="orb-check" size={17} />
            )}
          </span>
        </motion.button>
      ))}
      <button
        type="button"
        className="motion-toggle"
        onClick={() => setPaused(!paused)}
        aria-label={t(
          paused ? "Resume floating motion" : "Pause floating motion",
        )}
        title={t(paused ? "Resume floating motion" : "Pause floating motion")}
      >
        {paused ? <Play size={14} /> : <Pause size={14} />}
      </button>
      <div className="mix-note">
        <Hand size={15} />
        {t("Tap or drag to mix")}
      </div>
      <div className="mix-result" aria-live="polite">
        {selected.length > 0 && (
          <>
            <span>{t(hint || "Your mix is ready to explore.")}</span>
            <A href="/discover/onboarding">
              {t("Discover your possibilities")} <ArrowUpRight size={14} />
            </A>
          </>
        )}
      </div>
    </div>
  );
}
export default function Home() {
  const { t } = useLanguage();
  return (
    <HomeReveals>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="tiny-line" /> {t("CAREER & WELLNESS PORTAL")}
            </div>
            <h1>
              {t("Discover")}
              <br />
              {t("what’s")}{" "}
              <em>
                {t("possible")}
                <span>.</span>
              </em>
            </h1>
            <p className="hero-motto">
              {t("Your mind. Your strengths. Your future.")}
            </p>
            <p className="hero-description">
              {t(
                "Career counselling, psychological wellness and professional support, all in one place.",
              )}
            </p>
            <div className="hero-actions">
              <Btn href="/booking?service=Career%20guidance%20and%20counselling">
                {t("Book career counselling")} <Compass size={18} />
              </Btn>
              <A className="underlink" href="/services">
                {t("Our services")}
              </A>
            </div>
          </div>
          <FutureMix />
        </div>
        <div className="hero-foot">
          <a href="#paths">
            <ArrowDown size={14} /> {t("Scroll to explore")}
          </a>
          <span>
            <span className="mini-orbit" /> {t("Interactive Future Mix")}
          </span>
        </div>
      </section>
      <section id="paths" className="home-section path-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span className="tiny-line" /> {t("YOUR PATHWAYS")}
            </div>
            <h2>
              <RevealWords text={t("Choose your path")} />
              <i>.</i>
            </h2>
          </div>
          <A href="/portal" className="text-link">
            {t("View all portals")} <LayoutIcon />
          </A>
        </div>
        <div className="path-grid">
          {paths.map(({ n, d, href, icon: Icon, img, className }) => (
            <A href={href} className={"path-card " + className} key={n}>
              <img src={"/images/path-" + img + ".webp"} alt="" />
              <div className="path-wash" />
              <div className="path-content">
                <span className="path-icon">
                  <Icon size={21} />
                </span>
                <div>
                  <h3>{t(n)}</h3>
                  <p>{t(d)}</p>
                </div>
              </div>
              <span className="circle-link">
                <MoveUpRight size={17} />
              </span>
            </A>
          ))}
        </div>
      </section>
      <section className="home-section journey">
        <div>
          <div className="eyebrow">
            <span className="tiny-line" /> {t("EXPLORE YOUR OPTIONS")}
          </div>
          <h2>
            <RevealWords text={t("One place.")} />
            <br />
            <em>
              <RevealWords text={t("Many ways forward.")} />
            </em>
          </h2>
        </div>
        <div className="journey-list">
          {[
            [
              GraduationCap,
              "Career World",
              "Compare careers and study pathways.",
              "/careers",
            ],
            [
              Flower2,
              "Wellness Space",
              "Find a reflection or a short exercise.",
              "/wellness",
            ],
            [
              Sparkles,
              "Future Games",
              "Try the Career Match Challenge.",
              "/games",
            ],
            [
              Fingerprint,
              "My Future",
              "Turn a goal into small milestones.",
              "/my-future",
            ],
          ].map(([I, n, d, url]) => {
            const Icon = I as typeof Star;
            return (
              <A href={String(url)} key={String(n)}>
                <Icon />
                <div>
                  <b>{t(String(n))}</b>
                  <p>{t(String(d))}</p>
                </div>
                <ArrowUpRight size={18} />
              </A>
            );
          })}
        </div>
      </section>
      <section className="home-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t("GUIDANCE")}</div>
            <h2>
              <RevealWords text={t("Support that grows with you")} />
              <i>.</i>
            </h2>
          </div>
          <Btn href="/team" light>
            {t("Meet the team")}
          </Btn>
        </div>
        <div className="tiles team-grid">
          {practitioners.map((p) => (
            <A
              key={p.name}
              className={p.founder ? "tile founder-card" : "tile"}
              href={"/team?profile=" + p.id}
            >
              <PractitionerIdentity person={p} />
            </A>
          ))}
        </div>
      </section>
      <section className="home-section">
        <div className="section-heading">
          <h2>
            <RevealWords text={t("Tools and opportunities")} />
            <i>.</i>
          </h2>
        </div>
        <Cards
          items={[
            [
              "Opportunity Hub",
              "/opportunities",
              "Browse funding and learning opportunities.",
            ],
            [
              "Career Toolkit",
              "/career-toolkit",
              "Build a CV or draft a cover letter.",
            ],
            [
              "Events & workshops",
              "/events",
              "Explore upcoming demonstration sessions.",
            ],
            ["Parent support", "/parent/dashboard"],
            ["School partnerships", "/school/dashboard"],
            ["Corporate wellness", "/corporate/dashboard"],
          ]}
        />
      </section>
    </HomeReveals>
  );
}
function LayoutIcon() {
  return <ArrowUpRight size={16} />;
}
