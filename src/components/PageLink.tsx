"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, type ComponentProps } from "react";

type PageLinkProps = Omit<ComponentProps<typeof Link>, "href" | "scroll" | "onNavigate"> & {
  href: string;
};

function scrollToPageTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

export function PageScroll() {
  const path = usePathname();
  const previous = useRef(path);
  useLayoutEffect(() => {
    if (previous.current !== path && !window.location.hash) scrollToPageTop();
    previous.current = path;
  }, [path]);
  return null;
}

export function PageLink({ href, ...props }: PageLinkProps) {
  const targetsSection = href.includes("#");
  return (
    <Link
      {...props}
      href={href}
      scroll={targetsSection}
      onNavigate={() => {
        if (targetsSection) return;
        // Clicking the current page does not mount a new route.
        const target = new URL(href, window.location.href);
        if (target.pathname.replace(/\/$/, "") === location.pathname.replace(/\/$/, "")) {
          // Finish after any smooth section scroll from the preceding frame.
          requestAnimationFrame(scrollToPageTop);
        }
      }}
    />
  );
}
