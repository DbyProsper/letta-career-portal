import {
  Fragment,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

export function RevealWords({ text }: { text: string }) {
  return (
    <span aria-label={text} role="group" className="reveal-words">
      {text.split(/\s+/).map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? " " : null}
          <span aria-hidden="true" className="word-mask">
            <span
              className="word-ink"
              style={
                {
                  "--word-delay": Math.min(index, 9) * 55 + "ms",
                } as CSSProperties
              }
            >
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}

export function HomeReveals({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current || !("IntersectionObserver" in window)) return;
    const elements = Array.from(
      root.current.querySelectorAll<HTMLElement>(
        ".home-section h2, .home-section .eyebrow, .home-section .section-heading > a, .path-grid > a, .journey-list > a, .home-section .tiles > a",
      ),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.reveal = "visible";
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.04 },
    );
    for (const element of elements) {
      const siblings = element.parentElement?.children;
      const position = siblings
        ? Array.prototype.indexOf.call(siblings, element)
        : 0;
      element.style.setProperty(
        "--reveal-delay",
        element.matches("a") ? Math.min(position, 3) * 85 + "ms" : "0ms",
      );
      element.dataset.reveal = "waiting";
      observer.observe(element);
    }
    return () => {
      observer.disconnect();
      for (const el of elements) {
        delete el.dataset.reveal;
        el.style.removeProperty("--reveal-delay");
      }
    };
  }, []);
  return (
    <div className="home-page" ref={root}>
      {children}
    </div>
  );
}
