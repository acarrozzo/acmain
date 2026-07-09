import type { Metadata } from "next";
import {
  Fraunces,
  Inter,
  Playfair_Display,
  Cormorant,
  Libre_Baskerville,
  Spectral,
  DM_Serif_Display,
} from "next/font/google";
import { ThemeScript } from "@/components/ThemeScript";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Additional editorial display faces for the in-header font tester.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cormorant",
  display: "swap",
});
const libre = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre",
  display: "swap",
});
const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-spectral",
  display: "swap",
});
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dmserif",
  display: "swap",
});

const fontVars = [
  fraunces.variable,
  inter.variable,
  playfair.variable,
  cormorant.variable,
  libre.variable,
  spectral.variable,
  dmSerif.variable,
].join(" ");

export const metadata: Metadata = {
  title: "AC — Design, Games, Systems & Worlds",
  description:
    "The central hub for the work of AC — software, games, tools, systems, and worlds. Past, present, and in progress.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
