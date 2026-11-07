export const person = {
  name: "Anthony Carrozzo",
  first: "Anthony",
  role: "Senior Product Designer",
  /** The one word under the name in the masthead. */
  title: "Designer",
  location: "Long Island, NY",
  since: 2004,
  portrait: "/img/p/anthony.webp",
  linkedin: "https://www.linkedin.com/in/acarrozzo/",

  /** Home page hero. */
  hero: {
    line: "I design and build software, games and music.",
    sub: "This is where anyone can learn what I'm about: what I'm making right now, what I've made before, and where it's all going.",
  },

  /** "About Anthony" box on the home page. */
  editorBlurb:
    "Hey, I’m Anthony. Senior Product Designer at MNTN by day. The rest of the time, all of this. Twenty-two years in, still shipping.",

  /** Now playing. Hand-picked until AC Music has a feed. */
  nowPlaying: {
    title: "She Knows",
    by: "Saint Anthony",
    note: "hip-hop, spoken word",
    href: "https://anthonymusic.vercel.app/",
    art: "/img/p/ac-music.webp",
  },

  /** Home page about teaser. */
  teaser:
    "Twenty-two years of designing things, and a habit of making games since before that. Currently a Senior Product Designer at MNTN, working on QuickFrame AI. The full story, including the early jobs, is on the about page.",

  /** About page. */
  about: [
    "My name's Anthony and I've been working as a designer for twenty-two years at a handful of equally amazing places. Right now I'm a Senior Product Designer at MNTN, working on QuickFrame AI. Before that I spent over a decade at Newsday, where I went from lead UI designer to Director of UX & Design and got to make things like an Emmy-winning dual-video documentary and a homepage that could survive election night.",
    "I have past experience in retail marketing, brand identity, music production and photography, and I always have a whole mess of other creative projects in the works. Lately the mess has gotten serious: a multiplayer RPG I've been building since the PHP days, a couple of games I'm remaking as proper web applications, and thirty years of songs finally produced the way I heard them.",
    "I hand-coded front-ends back when nobody called it engineering. These days, with much better tools, one person ships what used to take a team. That's most of what's going on around here.",
  ],

  skills: {
    pay: "Product design, design systems, UX research and testing, front-end (React, Next.js, TypeScript, Tailwind), Figma, motion, and the AI tools that turn a designer into a shipping team: Claude, Cursor and GPT.",
    dontPay: "Music, photography, writing, numchucks.",
  },

  timeline: [
    { year: "2004–2005", name: "Polyplastic Forms", text: "First job, a month before graduating. Ran a six-foot printer, a vinyl cutter and a CAD machine that carved things out of wood, plastic, metal and foam." },
    { year: "2005–2006", name: "I.D.S. Menus", text: "The big menu boards you see at a movie theater or coffee shop, print menus, and animated graphics in After Effects." },
    { year: "2006–2008", name: "Steve & Barry's", text: "Retail and fashion campaigns, celebrity clothing lines, a trip to India to train the team there. Also where I met my future bandmates." },
    { year: "2008–2009", name: "United Nations", text: "Design for peacekeeping initiatives, from the 40th floor, with the best cafeteria in New York." },
    { year: "2009–2011", name: "Mobileistic", text: "Marketing and catalogs for a wireless accessories distributor. Trade shows in Orlando and Vegas." },
    { year: "2011–2023", name: "Newsday", text: "Lead UI designer and front-end developer for eleven years, then Director of UX & Design, leading the design team across newsday.com, News12 and amNY. Three redesigns of newsday.com, the 2020 module system, NewsdayTV, and the investigative interactives, two of which won New York Emmys: Long Island Divided and The Fighter & The Father." },
    { year: "2023–Now", name: "MNTN", text: "Senior Product Designer. First as the sole designer on QuickFrame Marketplace: the design system, end-to-end UX, and a GA launch alongside engineering. Now on QuickFrame AI, the video platform Adweek named the best generative AI platform of 2026, on a design team small enough to count on one hand." },
  ],

  /** Under the employment list. */
  education: [
    { year: "2002–2005", name: "SUNY Farmingdale", text: "Bachelor of Technology in Visual Communications. International design studies in France, Belgium, Holland, Italy and Greece." },
    { year: "2000–2002", name: "Stony Brook University and NYIT", text: "Computer science coursework before Farmingdale." },
  ],

  /** The footer tells the origin story; this is about how the site works now. */
  siteStory: [
    "One home for everything I make: the design work, the games, the music, and whatever comes next. Each project gets its own page and its own log, so the site grows one entry at a time and never needs a redesign to make room for the next thing.",
    "The old version is kept in the archive, unedited, as a stable comparison to life before the machines came along and made us all superheroes.",
  ],
};
