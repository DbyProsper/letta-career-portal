"use client";
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
  Sparkles,
  Star,
  Target,
} from "lucide-react";
import { A, Btn, Cards } from "./ui";
import { useLanguage } from "../lib/language";
import { toggle, useLocal } from "../lib/store";
import { practitioners } from "../data/catalog";
const dimensions = [
  {
    name: "My interests",
    icon: Compass,
    text: "Explore what sparks your curiosity.",
  },
  {
    name: "My strengths",
    icon: Star,
    text: "Notice what comes naturally to you.",
  },
  {
    name: "My wellbeing",
    icon: Heart,
    text: "Make room for what helps you feel grounded.",
  },
  {
    name: "My ambitions",
    icon: Target,
    text: "Imagine a goal you would like to work towards.",
  },
];
const paths = [
  {
    n: "Career discovery",
    d: "Find a direction that feels like you.",
    href: "/discover",
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
  const [selected, set] = useLocal<string[]>("mix", []),
    [hint, show] = useState("");
  const center = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const reduced = useReducedMotion();
  function choose(i: number) {
    const n = dimensions[i];
    set((old) => toggle(old, n.name));
    show(selected.includes(n.name) ? "" : n.text);
  }
  return (
    <div className="hero-art" id="future-mix" data-mixed={selected.length > 0}>
      <div className="art-halo" />
      <div className="orbit-line one" />
      <div className="orbit-line two" />
      <div className="dot-matrix" />
      <div className="art-star s1">✳</div>
      <div className="art-star s2">✦</div>
      <img
        className="hero-person"
        alt="Smiling young woman looking ahead"
        src="/images/hero-discovery.webp"
      />
      <div
        className="mix-target"
        ref={center}
        aria-label="Drop a dimension here"
      >
        <Orbit size={19} />
        <span>Your next chapter</span>
        {selected.length > 0 && <b>{selected.length}/4</b>}
      </div>
      {dimensions.map(({ name, icon: Icon }, i) => (
        <motion.button
          key={name}
          className={
            "orb orb-" + i + (selected.includes(name) ? " selected" : "")
          }
          aria-pressed={selected.includes(name)}
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
          <span>
            <Icon size={17} />
          </span>
          {name}
          {selected.includes(name) && <Check size={15} />}
        </motion.button>
      ))}
      <div className="mix-note">
        <Hand size={15} />
        Tap or drag to mix
      </div>
      <div className="mix-result" aria-live="polite">
        {selected.length > 0 && (
          <>
            <span>{hint || "Your mix is ready to explore."}</span>
            <A href="/discover/onboarding">
              Discover your possibilities <ArrowUpRight size={14} />
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
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span className="tiny-line" /> CAREER & WELLNESS PORTAL
            </div>
            <h1>
              Discover
              <br />
              what’s{" "}
              <em>
                possible<span>.</span>
              </em>
            </h1>
            <p className="hero-motto">
              Your mind. Your strengths. Your future.
            </p>
            <p className="hero-description">
              Career guidance, psychological wellness and professional support,
              all in one place.
            </p>
            <div className="hero-actions">
              <Btn href="/discover/onboarding">
                {t("Start exploring")} <Compass size={18} />
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
            <ArrowDown size={14} /> Scroll to explore
          </a>
          <span>
            <span className="mini-orbit" /> Interactive Future Mix
          </span>
        </div>
      </section>
      <section id="paths" className="home-section path-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span className="tiny-line" /> YOUR PATHWAYS
            </div>
            <h2>
              {t("Choose your path")}
              <i>.</i>
            </h2>
          </div>
          <A href="/portal" className="text-link">
            View all portals <LayoutIcon />
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
                  <h3>{n}</h3>
                  <p>{d}</p>
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
            <span className="tiny-line" /> EXPLORE YOUR OPTIONS
          </div>
          <h2>
            One place.
            <br />
            <em>Many ways forward.</em>
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
                  <b>{String(n)}</b>
                  <p>{String(d)}</p>
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
            <div className="eyebrow">GUIDANCE</div>
            <h2>
              Support that grows with you<i>.</i>
            </h2>
          </div>
          <Btn href="/team" light>
            Meet the demo team
          </Btn>
        </div>
        <div className="tiles">
          {practitioners.map((p, i) => (
            <A key={p.name} className="tile" href={"/team?profile=" + i}>
              <img
                className="practitioner-photo"
                src={
                  "/images/practitioners/" +
                  p.name.split(" ")[0].toLowerCase() +
                  ".webp"
                }
                alt={"Illustrative portrait for " + p.name}
              />
              <small>Sample practitioner</small>
              <h3>{p.name}</h3>
              <p>{p.area}</p>
            </A>
          ))}
        </div>
      </section>
      <section className="home-section">
        <div className="section-heading">
          <h2>
            Tools and opportunities<i>.</i>
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
    </>
  );
}
function LayoutIcon() {
  return <ArrowUpRight size={16} />;
}
