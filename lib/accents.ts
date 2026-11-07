/** The accent choices offered inside the solar system: name, dark value, light value. */
export const ACCENTS: [string, string, string][] = [
  ["mint", "#63c99a", "#1f7a52"],
  ["amber", "#d8a84e", "#8a5a12"],
  ["sky", "#7cc4f5", "#24558f"],
  ["coral", "#f08a6a", "#b7452a"],
  ["lilac", "#b7a4f0", "#5b47b8"],
  ["lime", "#c3dc5c", "#5f7d10"],
  ["rose", "#ea8fb0", "#b03a66"],
  ["ice", "#9fdcd6", "#1f7272"],
  ["bone", "#e6dcc6", "#6b5a3a"],
  ["sage", "#a3b89c", "#4f6b48"],
];
export const DEFAULT_ACCENT = "mint";
export const ACCENT_KEY = "ac-accent";

/** CSS for every accent in both themes. Rendered once into a <style> by the layout. */
export function accentCss(): string {
  return ACCENTS.map(
    ([n, dark, light]) =>
      `html[data-a="${n}"]{--accent:${light};--accent-hi:color-mix(in oklab,${light} 70%,white);--accent-soft:color-mix(in oklab,${light} 10%,transparent);--glow:color-mix(in oklab,${light} 25%,transparent)}` +
      `html.dark[data-a="${n}"]{--accent:${dark};--accent-hi:color-mix(in oklab,${dark} 70%,white);--accent-soft:color-mix(in oklab,${dark} 14%,transparent);--glow:color-mix(in oklab,${dark} 35%,transparent)}`
  ).join("");
}
