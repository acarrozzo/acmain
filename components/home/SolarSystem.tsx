"use client";

import { useEffect, useRef } from "react";
import { mountSolarSystem, type SystemPlanet } from "@/lib/solar-system";
import { MARK_PATH } from "@/components/mark-path";

/** The home page's toy: mounts the canvas system and its tune panel. */
export function SolarSystem({ planets }: { planets: SystemPlanet[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return mountSolarSystem(ref.current, { planets, mark: MARK_PATH });
  }, [planets]);
  // The placeholder holds the system's footprint until the canvas mounts, so the page never jumps.
  return (
    <div className="h-system" ref={ref}>
      <div className="h-ph" aria-hidden="true" />
    </div>
  );
}
