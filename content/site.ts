export const site = {
  /** The wordmark. Rendered as "AC." with the accent dot. */
  mark: "AC",
  name: "Anthony Carrozzo",
  /** Production origin. Used for metadata, the sitemap and OpenGraph. */
  url: "https://acarrozzo.com",
  title: "Anthony Carrozzo",
  tagline: "Design, games, music.",
  /** Under the mark in the masthead. */
  motto: "All the news that’s fit to ship.",
  /** Footer version line. Bump it when the site changes shape. */
  version: "v.26",
  since: "since the 90s",
  /**
   * The photo ghosted behind the top of every page: the forest in dark,
   * the daylight sky in light. A world can override it with its own
   * `backdrop` in `content/worlds.ts`.
   */
  backdrop: { dark: "/img/forest-dark.webp", light: "/img/sky-light.webp" },
  description:
    "Anthony Carrozzo is a product designer from Long Island who has been designing for over twenty years and making games for longer. This is where anyone can learn what he's about: software, games, music, and what's being built right now.",
  email: "acarrozzo@gmail.com",
  /**
   * Where the original site lives once this one takes over acarrozzo.com.
   * Today the old site *is* acarrozzo.com; move it to a subdomain at
   * cutover and update this one line.
   */
  archiveUrl: "https://www.acarrozzo.com",
  archiveLabel: "The original acarrozzo.com",
};
