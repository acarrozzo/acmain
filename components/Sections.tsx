"use client";

import { motion } from "motion/react";
import { about, community, currentlyBuilding, featured } from "@/lib/content";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted">
      {children}
    </span>
  );
}

export function CurrentlyBuilding() {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <motion.div {...reveal}>
          <SectionLabel>Currently building</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight tracking-tight md:text-5xl">
            What’s in the workshop right now.
          </h2>
        </motion.div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {currentlyBuilding.map((item, i) => (
            <motion.div
              key={item.title}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.08 }}
              className="flex flex-col gap-4 bg-surface p-7"
            >
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {item.status}
              </span>
              <h3 className="text-xl tracking-tight">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{item.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedWork() {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <motion.div {...reveal}>
          <SectionLabel>Featured work</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-3xl leading-tight tracking-tight md:text-5xl">
            A few things worth discovering.
          </h2>
        </motion.div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {featured.map((item, i) => (
            <motion.a
              key={item.title}
              href={item.href}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.06 }}
              className="group relative flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-2xl border border-line bg-surface-2 p-7"
            >
              {/* Imagery placeholder — a calm tonal field carries the space until art lands */}
              <div className="field-glow absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
              <div
                className="absolute inset-0 opacity-[0.06] transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 30%, currentColor 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
              <div className="relative">
                <span className="text-xs uppercase tracking-widest text-muted">
                  {item.kind}
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <h3 className="text-2xl tracking-tight md:text-3xl">
                    {item.title}
                  </h3>
                  <span className="translate-x-0 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="scroll-mt-24 border-t border-line py-24 md:py-32">
      <div className="container-page grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
        <motion.div {...reveal}>
          <SectionLabel>About</SectionLabel>
        </motion.div>
        <motion.p
          {...reveal}
          className="max-w-2xl text-2xl leading-snug tracking-tight text-ink-soft md:text-4xl"
        >
          {about.body}
        </motion.p>
      </div>
    </section>
  );
}

export function Community() {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <div className="container-page">
        <motion.div {...reveal} className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Community & follow</SectionLabel>
            <h2 className="mt-4 max-w-xl text-3xl leading-tight tracking-tight md:text-5xl">
              There’s always something new to discover.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {community.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
              >
                {c.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="container-page flex flex-col items-center justify-between gap-3 text-sm text-muted sm:flex-row">
        <span className="mark text-lg text-ink">
          AC<span className="ac-dot">.</span>
        </span>
        <span>The creative universe of one designer. Built to grow for years.</span>
      </div>
    </footer>
  );
}

export function HomeSections() {
  return (
    <>
      <CurrentlyBuilding />
      <FeaturedWork />
      <About />
      <Community />
      <Footer />
    </>
  );
}
