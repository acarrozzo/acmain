export const site = {
  /** The wordmark. Rendered as "AC." with the accent dot. */
  mark: "AC",
  name: "Anthony Carrozzo",
  /** Production origin. Used for metadata, the sitemap and OpenGraph. */
  url: "https://acarrozzo.com",
  title: "Anthony Carrozzo",
  tagline: "Design, games, music.",
  /**
   * The photo ghosted behind the top of every page: the forest in dark,
   * the daylight sky in light. A category can override it with its own
   * `backdrop` in `content/categories.ts`.
   */
  backdrop: { dark: "/img/bg/forest-dark.webp", light: "/img/bg/sky-light.webp" },
  /**
   * The photo that rises up behind the bottom of every page and the
   * footer: the night sky in dark, the grass in light. Site-wide only;
   * categories don't override this one.
   */
  backdropBottom: { dark: "/img/bg/space-dark.webp", light: "/img/bg/beach.webp" },
  description:
    "Anthony Carrozzo is a product designer from Long Island who has been designing for over twenty years and making games for longer. This is where anyone can learn what he's about: software, games, music, and what's being built right now.",
  email: "acarrozzo@gmail.com",
  /**
   * The footer, composed like the original acarrozzo.com footer: a
   * headline, a subhead, the nav as pills, the site's story, the
   * portrait, the contact line and the small print. Edit the copy here.
   */
  footer: {
    heading: "Hey look at that",
    sub: "You've reached the footer",
    story:
      "This site began in the 90s as a fun place for me and my friends to share hilarious Photoshop stuff, post photos and chat. It has since evolved into a proper portfolio of my professional work, and remains a creative outlet for anything I feel like sharing. Feel free to contact me with anything.",
    contactLabel: "contact:",
    /** The site's first year, for the copyright range. */
    firstYear: 1998,
    homeLabel: "Take me home",
  },
  /**
   * Where the original site lives once this one takes over acarrozzo.com.
   * Today the old site *is* acarrozzo.com; move it to a subdomain at
   * cutover and update this one line.
   */
  archiveUrl: "https://www.acarrozzo.com",
  archiveLabel: "The original acarrozzo.com",
};
