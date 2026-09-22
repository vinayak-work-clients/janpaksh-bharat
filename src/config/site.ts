export const siteConfig = {
  name: "Janpaksh Bharat",
  nameHindi: "जनपक्ष भारत",
  // Hindi-first brand line; taglineEn is the English rendering used as a sub-line.
  tagline: "सुर्खियों से आगे, सच के भीतर",
  taglineEn: "Beyond the headlines, inside the truth.",
  description:
    "Janpaksh Bharat is an independent Indian newsroom covering current affairs, politics and society through fearless ground reporting, blogs, video and podcasts.",
  url: "https://janpakshbharat.com",
  contact: {
    name: "Gaurav Sharma",
    role: "CEO, Janpaksh Bharat",
    email: "gauravji0440@gmail.com",
    phone: "+91 94120 13624",
  },
  socials: {
    whatsapp: "#",
    instagram: "#",
    youtube: "#",
    x: "#",
    facebook: "#",
  },
  cta: {
    primary: { label: "Know More", href: "/about" },
    secondary: { label: "Get Connected", href: "#whatsapp" },
    whatsappLabel: "Join the Conversation",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Breaking", href: "/breaking" },
    { label: "Blogs", href: "/blogs" },
    { label: "Podcasts", href: "/podcasts" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  archiveNotice: "Content auto-archives after 30 days",
  hero: {
    kicker: "Independent · Current Affairs · Bharat",
    // The poster is never shown as a picture: it is blurred and dimmed into a
    // colour wash behind the news deck. Switch `background` to "solid" to
    // drop the wash and keep only the ink ground and saffron glow.
    poster:
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=2400&q=80",
    background: "wash" as "wash" | "solid",
    /** Number of stories in the floating news deck (min 5 when available). */
    deckSize: 6,
  },
  podcast: {
    showName: "Janpaksh Sunvai",
    showNameHindi: "जनपक्ष सुनवाई",
    blurb:
      "Long conversations with the people inside the story — ministers, farmers, founders and the reporters who cover them. New episodes every week.",
  },
  listenOn: {
    spotify: "#",
    apple: "#",
    youtube: "#",
  },
  about: {
    mission:
      "Janpaksh Bharat exists to report India from the ground up — to stand on the people's side of every story, verify before we publish, and hold power to account in the languages people actually speak.",
    storyParagraphs: [
      "Janpaksh Bharat began with a simple frustration: the stories that mattered most to our towns rarely made it past the district edition. A water dispute in Tehri, a school without teachers in Bundelkhand, a cooperative that quietly changed how a village earned — these were the stories shaping lives, and they were invisible from Delhi.",
      "So we started reporting them ourselves. First on WhatsApp, then on a website, then with a camera and a microphone. Our newsroom is small by design: reporters who live where they report, editors who know the difference between a rumour and a source, and a community that tells us what to chase next.",
      "We publish in Hindi and English because our readers do. We keep every story live for thirty days and then archive it, because we would rather be trusted for what is happening now than for the size of our back catalogue. And we take no money that we cannot label.",
    ],
    values: [
      {
        title: "Independent",
        text: "No party, no proprietor, no undisclosed sponsor. Every rupee that funds our reporting is labelled on the page.",
      },
      {
        title: "Ground-first",
        text: "We go to the place. Reporting from a desk is not reporting; it is repetition. Our bylines carry a district, not just a name.",
      },
      {
        title: "People-first",
        text: "The person affected by a decision is the first source, not the last. Officials answer to the story, not the other way round.",
      },
      {
        title: "Accountable",
        text: "We publish corrections at the top of the story, with a date. If we cannot stand behind a claim on the record, we do not print it.",
      },
    ],
    stats: [
      { label: "Stories this month", value: "48" },
      { label: "Districts covered", value: "31" },
      { label: "Community members", value: "12k" },
      { label: "Podcast episodes", value: "12" },
    ],
    location: "Uttarakhand, India",
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type NavItem = (typeof siteConfig.nav)[number];
