import type { Metadata } from "next";
import "@fontsource/plus-jakarta-sans/latin-700.css";
import "@fontsource/plus-jakarta-sans/latin-800.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-600.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "Letta Consulting | Discover what’s possible",
  description:
    "Explore career pathways, wellbeing resources and professional support with Letta Consulting.",
  icons: { icon: "/brand/letta-consulting-logo.png" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
