import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { ThemeScript } from "@/components/ThemeScript";
import { accentCss } from "@/lib/accents";
import { site } from "@/content/site";
import "./globals.css";
import "./home.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.title} · ${site.tagline}`,
    template: `%s · ${site.title}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.title,
    title: `${site.title} · ${site.tagline}`,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <style dangerouslySetInnerHTML={{ __html: accentCss() }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
