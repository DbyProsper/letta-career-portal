"use client";
import { MotionConfig } from "motion/react";
import Home from "./Home";
import { A, Footer, Header, RolePicker } from "./ui";
import { practiceTabs, slug, youthLinks } from "../data/catalog";
import { useLanguage } from "../lib/language";
import {
  CareerWorld,
  Discovery,
  Games,
  MyFuture,
  Opportunities,
  YouthDashboard,
} from "../features/Discovery";
import { Events, Info, Library, Services, Team } from "../features/Public";
import { PortalIndex, RoleDashboard } from "../features/Portals";
import Practice from "../features/Practice";
import BookingFlow from "../features/Booking";
import { Toolkit } from "../features/Toolkit";
function Content({ path: p }: { path: string }) {
  if (p === "/") return <Home />;
  if (p === "/discover") return <YouthDashboard />;
  if (p.startsWith("/discover/")) return <Discovery path={p} />;
  if (p.startsWith("/careers")) return <CareerWorld path={p} />;
  if (p === "/games") return <Games />;
  if (p === "/my-future") return <MyFuture />;
  if (p === "/opportunities") return <Opportunities />;
  if (p === "/wellness" || p === "/resources")
    return <Library wellness={p === "/wellness"} />;
  if (p.startsWith("/career-toolkit")) return <Toolkit path={p} />;
  if (p.startsWith("/booking"))
    return <BookingFlow confirmation={p.endsWith("/confirmation")} />;
  if (p.startsWith("/services")) return <Services path={p} />;
  if (p === "/team") return <Team />;
  if (p === "/events") return <Events />;
  if (p === "/portal") return <PortalIndex />;
  if (p === "/practice" || p.startsWith("/practice/"))
    return <Practice path={p} />;
  if (p.endsWith("/dashboard")) return <RoleDashboard path={p} />;
  return <Info path={p} />;
}
export default function Portal({ path }: { path: string }) {
  const practice = path.startsWith("/practice"),
    role = path.endsWith("/dashboard"),
    youth = youthLinks.some(([, p]) => path === p || path.startsWith(p + "/"));
  const workspace = practice || role || youth;
  const { t } = useLanguage();
  const links = practice
    ? practiceTabs.map((v, i) => [v, i ? "/practice/" + slug(v) : "/practice"])
    : role
      ? [
          ["Dashboard", path],
          ["Resources", "/resources"],
          ["Book a session", "/booking"],
          ["Contact", "/contact"],
        ]
      : youthLinks;
  return (
    <MotionConfig reducedMotion="user">
      <Header path={path} />
      {workspace ? (
        <div className="workspace">
          <nav className="sidebar" aria-label="Workspace navigation">
            <RolePicker path={path} />
            <h2>
              {practice
                ? "Practice team"
                : role
                  ? "My workspace"
                  : "Youth workspace"}
            </h2>
            {links.map(([n, p]) => (
              <A
                key={p}
                href={p}
                aria-current={path === p ? "page" : undefined}
                className={path === p ? "active" : ""}
              >
                {t(n)}
              </A>
            ))}
          </nav>
          <main id="main" key={path}>
            <Content path={path} />
          </main>
        </div>
      ) : (
        <main
          id="main"
          className={path === "/" ? "" : "public-wrap"}
          key={path}
        >
          {path !== "/" && (
            <div className="crumb">
              <A href="/">{t("Home")}</A> /{" "}
              {path.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ")}
            </div>
          )}
          <Content path={path} />
        </main>
      )}
      <Footer />
    </MotionConfig>
  );
}
