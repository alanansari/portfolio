import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { FloatingThemeToggle } from "@/components/FloatingThemeToggle";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeScript } from "@/components/ThemeScript";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alan Ansari — Software Engineer",
  description:
    "Software engineer building fast, thoughtful web interfaces.",
  openGraph: {
    title: "Alan Ansari — Software Engineer",
    description:
      "Software engineer building fast, thoughtful web interfaces.",
    type: "website",
  },
  metadataBase: new URL("https://devalan.in"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <FloatingThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
