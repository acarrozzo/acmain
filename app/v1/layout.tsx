import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./v1.css";

/**
 * TEMPORARY. The site as it was before the Nov 2026 redesign, mounted under
 * /v1 as a visual reference while the new one settles. It is a verbatim copy
 * of the old app/, components/, lib/ and content/ (now in app/v1 and v1/)
 * with its links prefixed. To remove it: delete app/v1 and v1/.
 */
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function V1Layout({ children }: { children: React.ReactNode }) {
  return <div className={`v1 ${instrument.variable}`}>{children}</div>;
}
