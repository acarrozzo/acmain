import type { Project } from "../types";

const img = (name: string) => `/img/qfmp/qfmp-${name}.jpg`;

export const quickframeMarketplace: Project = {
  slug: "quickframe-marketplace",
  name: "QuickFrame Marketplace",
  short: "Marketplace",
  world: "design",
  kind: "Case study",
  status: "live",
  line: "A shared workspace for brands and video creators to make custom commercials, from the first brief to final delivery.",
  blurb:
    "Brands build a brief and check out, matched creators bid, and both sides run the production together: deliverables, revision rounds, conversation and final delivery in one place.",
  hero: img("logo"),
  tags: ["Marketplace", "Two-sided", "Design system"],
  mark: "QM",
  started: 2024,
  ended: 2026,
  facts: [
    { label: "Role", value: "Sole product designer" },
    { label: "Time", value: "About 18 months" },
    { label: "Team", value: "About six engineers, plus product and business partners" },
  ],
  body: [
    {
      image: img("logo"),
      alt: "The QuickFrame Marketplace wordmark on the product's deep blue gradient.",
      plate: true,
    },
    "Before Marketplace, the process ran largely through a middleman exchanging emails between everyone involved. I joined at the beginning and designed the product from initial concepts through launch and ongoing improvements, working alongside about six engineers and partners across product and the business.",
    {
      image: img("project-brief"),
      alt: "A brand's project view in QuickFrame Marketplace: the brief for a Onewheel fall campaign, with reference image, dates, language, a description, the services included and the deliverables the production will end with.",
      caption:
        "A brand's project view. The brief, reference files, dates, the services that build the production, and the deliverables it will end with. Every production on the platform is organized this way.",
    },
    "I designed every screen across the brand and creator experiences, the internal administration tools, and a complete Figma design system. Brands could build a brief, select services and extras, check out, and review bids from matched creators. Once a creator was selected, both sides could manage deliverables, revision rounds, communication, and final delivery together.",
    {
      image: img("bid-offer"),
      alt: "The bid offer screen: a creator's studio profile and pitch on the left, a price of $20,000, and a column of video examples on the right, with Dismiss Bid and Accept Bid actions at the bottom.",
      caption:
        "Reviewing a bid. Matched creators answer the brief with a price, a pitch and examples of their work. The brand chooses a creator from here.",
    },
    "The challenge was making a detailed production process approachable for people with different levels of technical experience. Familiar flows, clear language, and explanations where they were needed helped keep the interface useful without overwhelming it. Research, usability testing, and feedback from users and customer-facing teams informed the work.",
    {
      image: img("sign-up"),
      alt: "The create-an-account screen, which asks whether you are a brand looking for a video producer or a maker looking to connect with brands before asking for a name and email.",
      caption:
        "The front door asks one question first, in plain words: brand or maker. From there the product speaks to that side.",
    },
    {
      image: img("design-system-variables"),
      alt: "The Figma variables panel of the QuickFrame design system, showing semantic color tokens with three modes: the current dark interface, the original classic palette, and light mode.",
      caption:
        "The Figma design system, second generation. Semantic variables with modes for the original palette, the current dark interface and a light one, so the brand, creator and administration screens all shared one set of components.",
    },
    {
      image: img("final-deliverables"),
      alt: "The deliverables screen at final files: a list of completed cutdowns and files on the left, and the selected concept video with a download button and version history on the right.",
      caption:
        "Final delivery. Every cut and file moves through revision rounds to a completed state, and the brand downloads finished work from the same place the creator uploaded it.",
    },
    "The platform remains in use, with feature development ending as the team moved to QuickFrame AI.",
  ],
};
