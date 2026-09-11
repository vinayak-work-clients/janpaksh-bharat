import type { Post, PostType } from "@/types/content";
import { bodies, standfirsts } from "@/data/post-bodies";

/* ------------------------------------------------------------------ */
/*  Date helpers                                                       */
/*  Dates are generated relative to the build/request time so that     */
/*  the 30-day archive window stays meaningful during development.     */
/* ------------------------------------------------------------------ */

const DAY_MS = 24 * 60 * 60 * 1000;
const EXPIRY_DAYS = 30;

// Anchor to the top of the current hour so server and client agree.
const NOW = (() => {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  return d;
})();

function daysAgo(days: number, hour = 9, minute = 0): string {
  const d = new Date(NOW.getTime() - days * DAY_MS);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function addDays(iso: string, days: number): string {
  return new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

// Google-hosted sample MP4s — stable, CORS-friendly, always online.
const GVIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample";

type Seed = Omit<Post, "expiresAt" | "body" | "standfirst">;

const seeds: Seed[] = [
  /* ------------------------------ BREAKING ------------------------------ */
  {
    id: "p01",
    slug: "cabinet-clears-national-water-security-mission",
    type: "breaking",
    title: "Cabinet clears ₹1.2 lakh crore National Water Security Mission",
    titleHindi: "कैबिनेट ने ₹1.2 लाख करोड़ के राष्ट्रीय जल सुरक्षा मिशन को मंज़ूरी दी",
    excerpt:
      "The five-year mission will fund aquifer recharge, canal modernisation and tanker-free water supply in 240 drought-prone districts, the Union Cabinet announced this morning.",
    category: "Politics",
    tags: ["cabinet", "water", "policy"],
    coverImage: unsplash("1587474260584-136574528ed5"),
    author: { name: "Priya Raghunathan" },
    publishedAt: daysAgo(0, 8, 15),
    isBreaking: true,
    featured: true,
    readTimeMin: 3,
  },
  {
    id: "p02",
    slug: "rbi-holds-repo-rate-signals-growth-focus",
    type: "breaking",
    title: "RBI holds repo rate at 5.5%, signals shift to growth support",
    titleHindi: "RBI ने रेपो दर 5.5% पर बरकरार रखी, विकास पर ज़ोर के संकेत",
    excerpt:
      "The Monetary Policy Committee voted 5–1 to keep rates unchanged while lowering its inflation forecast for the second half of the fiscal year.",
    category: "Economy",
    tags: ["rbi", "monetary-policy", "markets"],
    coverImage: unsplash("1611974789855-9c2a0a7236a3"),
    author: { name: "Arjun Mehta" },
    publishedAt: daysAgo(1, 11, 30),
    isBreaking: true,
    readTimeMin: 2,
  },

  /* -------------------------------- IMAGE -------------------------------- */
  {
    id: "p03",
    slug: "farmers-punjab-stubble-alternative-pilot",
    type: "image",
    title: "In Punjab's fields, a quiet experiment to end stubble burning",
    titleHindi: "पंजाब के खेतों में पराली जलाने के विकल्प का एक ख़ामोश प्रयोग",
    excerpt:
      "Across 40 villages in Sangrur, farmers are trialling in-situ decomposers and happy seeders. Early yields are promising — but the subsidy paperwork is not.",
    category: "Environment",
    tags: ["agriculture", "punjab", "air-quality"],
    coverImage: unsplash("1500937386664-56d1dfef3854"),
    author: { name: "Harpreet Kaur" },
    publishedAt: daysAgo(1, 7, 0),
    featured: true,
    readTimeMin: 6,
  },
  {
    id: "p04",
    slug: "mumbai-monsoon-coastal-road-first-test",
    type: "image",
    title: "Mumbai's coastal road faces its first full monsoon",
    titleHindi: "मुंबई की कोस्टल रोड का पहला पूरा मानसून",
    excerpt:
      "Record September rainfall has put the ₹13,000 crore project to the test. We spent three days at the Worli interchange watching what worked and what flooded.",
    category: "Society",
    tags: ["mumbai", "infrastructure", "monsoon"],
    coverImage: unsplash("1529253355930-ddbe423a2ac7"),
    author: { name: "Neha Deshpande" },
    publishedAt: daysAgo(2, 16, 45),
    readTimeMin: 5,
  },
  {
    id: "p05",
    slug: "varanasi-ghats-restoration-heritage-debate",
    type: "image",
    title: "The ghats of Varanasi get a facelift — and a heritage fight",
    titleHindi: "वाराणसी के घाटों का कायाकल्प — और विरासत की लड़ाई",
    excerpt:
      "Conservationists say the new stone cladding erases three centuries of layered history. The corporation says the old steps were crumbling into the Ganga.",
    category: "Culture",
    tags: ["heritage", "varanasi", "urban"],
    coverImage: unsplash("1532375810709-75b1da00537c"),
    author: { name: "Aditya Tripathi" },
    publishedAt: daysAgo(4, 10, 0),
    readTimeMin: 7,
  },
  {
    id: "p06",
    slug: "delhi-metro-phase-4-tunnel-boring-complete",
    type: "image",
    title: "Delhi Metro Phase 4 completes its longest tunnel under the Ridge",
    excerpt:
      "The 3.2 km twin tunnel between Majlis Park and Azadpur was bored without a single surface settlement complaint — an engineering first for the city.",
    category: "Society",
    tags: ["delhi", "transport", "infrastructure"],
    coverImage: unsplash("1519494026892-80bbd2d6fd0d"),
    author: { name: "Rohan Bhattacharya" },
    publishedAt: daysAgo(6, 9, 20),
    readTimeMin: 4,
  },
  {
    id: "p07",
    slug: "india-womens-cricket-world-cup-squad",
    type: "image",
    title: "Selectors back youth: three uncapped players in India's World Cup squad",
    titleHindi: "चयनकर्ताओं का युवाओं पर भरोसा: विश्व कप टीम में तीन नए चेहरे",
    excerpt:
      "A 19-year-old left-arm spinner from Jharkhand headlines a squad that signals a generational reset ahead of the home tournament.",
    category: "Sports",
    tags: ["cricket", "world-cup", "women"],
    coverImage: unsplash("1540747913346-19e32dc3e97e"),
    author: { name: "Sneha Iyer" },
    publishedAt: daysAgo(8, 18, 0),
    readTimeMin: 3,
  },
  {
    id: "p08",
    slug: "jaipur-heritage-walk-pink-city-tourism",
    type: "image",
    title: "Can Jaipur's old city survive its own popularity?",
    titleHindi: "क्या जयपुर का पुराना शहर अपनी लोकप्रियता झेल पाएगा?",
    excerpt:
      "Tourist footfall in the walled city has doubled since the UNESCO tag. Residents say the havelis are being hollowed out into cafés and Airbnbs.",
    category: "Culture",
    tags: ["jaipur", "tourism", "heritage"],
    coverImage: unsplash("1477587458883-47145ed94245"),
    author: { name: "Meera Rathore" },
    publishedAt: daysAgo(11, 12, 0),
    readTimeMin: 6,
  },

  /* -------------------------------- BLOG --------------------------------- */
  {
    id: "p09",
    slug: "why-india-needs-a-right-to-repair-law",
    type: "blog",
    title: "Why India needs a real Right to Repair law, not a portal",
    titleHindi: "भारत को पोर्टल नहीं, असली 'मरम्मत का अधिकार' क़ानून चाहिए",
    excerpt:
      "Two years after the Right to Repair portal launched, not a single manufacturer has been penalised. The problem isn't awareness — it's enforcement.",
    category: "Technology",
    tags: ["consumer-rights", "policy", "e-waste"],
    coverImage: unsplash("1518770660439-4636190af475"),
    author: { name: "Kabir Anand" },
    publishedAt: daysAgo(2, 9, 0),
    featured: true,
    readTimeMin: 8,
  },
  {
    id: "p10",
    slug: "gig-workers-social-security-code-explained",
    type: "blog",
    title: "The gig worker social security code, explained in plain language",
    titleHindi: "गिग वर्कर सामाजिक सुरक्षा संहिता — सरल भाषा में",
    excerpt:
      "Who pays, who qualifies, and why delivery riders in Bengaluru are still waiting for their first insurance card.",
    category: "Economy",
    tags: ["labour", "gig-economy", "explainer"],
    coverImage: unsplash("1617347454431-f49d7ff5c3b1"),
    author: { name: "Fatima Sheikh" },
    publishedAt: daysAgo(3, 14, 30),
    readTimeMin: 9,
  },
  {
    id: "p11",
    slug: "solar-rooftops-uttar-pradesh-villages",
    type: "blog",
    title: "One village, 300 rooftops: how Bundelkhand went solar",
    titleHindi: "एक गाँव, 300 छतें: बुंदेलखंड कैसे सौर ऊर्जा से रोशन हुआ",
    excerpt:
      "A self-help group of 40 women runs the maintenance cooperative. The power bill of the average household has fallen to zero — and stayed there.",
    category: "Environment",
    tags: ["solar", "rural", "energy"],
    coverImage: unsplash("1509391366360-2e959784a276"),
    author: { name: "Vikram Chauhan" },
    publishedAt: daysAgo(5, 8, 45),
    readTimeMin: 7,
  },
  {
    id: "p12",
    slug: "nep-2020-five-years-classroom-report",
    type: "blog",
    title: "Five years of NEP 2020: what actually changed in the classroom",
    titleHindi: "NEP 2020 के पाँच साल: कक्षा में असल में क्या बदला",
    excerpt:
      "We visited 14 government schools across three states. Mother-tongue instruction is real; the 'no-detention' rollback is uneven; teacher vacancies are unchanged.",
    category: "Society",
    tags: ["education", "policy", "ground-report"],
    coverImage: unsplash("1427504494785-3a9ca7044f45"),
    author: { name: "Ananya Bose" },
    publishedAt: daysAgo(7, 10, 10),
    readTimeMin: 11,
  },
  {
    id: "p13",
    slug: "upi-cross-border-payments-next-frontier",
    type: "blog",
    title: "UPI's next frontier is the Gulf — and the maths is complicated",
    excerpt:
      "Remittances from the UAE alone touch $20 billion a year. Making them instant means rewiring currency settlement, not just apps.",
    category: "Technology",
    tags: ["fintech", "upi", "remittances"],
    coverImage: unsplash("1551288049-bebda4e38f71"),
    author: { name: "Arjun Mehta" },
    publishedAt: daysAgo(10, 15, 0),
    readTimeMin: 6,
  },

  /* -------------------------------- VIDEO -------------------------------- */
  {
    id: "p14",
    slug: "video-inside-kolkata-tram-last-depot",
    type: "video",
    title: "Inside Kolkata's last working tram depot",
    titleHindi: "कोलकाता के आख़िरी चालू ट्राम डिपो के अंदर",
    excerpt:
      "A 6-minute film with the drivers, mechanics and commuters keeping a 150-year-old system alive against the odds.",
    category: "Culture",
    tags: ["kolkata", "transport", "documentary"],
    coverImage: unsplash("1519501025264-65ba15a82390"),
    mediaUrl: `${GVIDEO}/ForBiggerEscapes.mp4`,
    durationSec: 372,
    author: { name: "Debojyoti Sen" },
    publishedAt: daysAgo(1, 19, 0),
    readTimeMin: 6,
  },
  {
    id: "p15",
    slug: "video-himachal-cloudburst-ground-report",
    type: "video",
    title: "Ground report: after the Himachal cloudburst",
    titleHindi: "ग्राउंड रिपोर्ट: हिमाचल में बादल फटने के बाद",
    excerpt:
      "Roads gone, relief slow. Our correspondent walks 11 km to reach a village cut off for nine days.",
    category: "Environment",
    tags: ["himachal", "disaster", "climate"],
    coverImage: unsplash("1506905925346-21bda4d32df4"),
    mediaUrl: `${GVIDEO}/ForBiggerBlazes.mp4`,
    durationSec: 488,
    author: { name: "Tenzin Dolma" },
    publishedAt: daysAgo(5, 20, 30),
    readTimeMin: 8,
  },
  {
    id: "p16",
    slug: "video-ipl-auction-economics-explained",
    type: "video",
    title: "The economics of an IPL auction in 4 minutes",
    excerpt:
      "Purse caps, RTM cards and why a 21-year-old uncapped bowler can cost more than a World Cup winner.",
    category: "Sports",
    tags: ["cricket", "ipl", "explainer"],
    coverImage: unsplash("1531415074968-036ba1b575da"),
    mediaUrl: `${GVIDEO}/ForBiggerFun.mp4`,
    durationSec: 251,
    author: { name: "Sneha Iyer" },
    publishedAt: daysAgo(9, 17, 0),
    readTimeMin: 4,
  },

  /* ------------------------------- PODCAST ------------------------------- */
  {
    id: "p17",
    slug: "podcast-janpaksh-ep-12-delimitation",
    type: "podcast",
    title: "Janpaksh Podcast Ep. 12 — Delimitation: the map that will decide 2029",
    titleHindi: "जनपक्ष पॉडकास्ट अंक 12 — परिसीमन: वो नक्शा जो 2029 तय करेगा",
    excerpt:
      "Constitutional scholar Radhika Menon on why the next redrawing of Lok Sabha seats is the biggest political story nobody is covering.",
    category: "Politics",
    tags: ["podcast", "elections", "constitution"],
    coverImage: unsplash("1478737270239-2f02b77fc618"),
    // Public sample mp3 so the MiniPlayer's native audio path can be exercised.
    mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    embedUrl: "https://open.spotify.com/embed/show/4rOoJ6Egrf8K2IrywzwOMk?utm_source=generator&theme=0",
    durationSec: 2940,
    author: { name: "Gaurav Sharma" },
    publishedAt: daysAgo(3, 6, 0),
    readTimeMin: 49,
  },
  {
    id: "p18",
    slug: "podcast-janpaksh-ep-11-startup-layoffs",
    type: "podcast",
    title: "Janpaksh Podcast Ep. 11 — Life after the startup layoffs",
    titleHindi: "जनपक्ष पॉडकास्ट अंक 11 — स्टार्टअप छँटनी के बाद की ज़िंदगी",
    excerpt:
      "Three engineers from Bengaluru, Gurugram and Pune on severance, silence and what they built next.",
    category: "Economy",
    tags: ["podcast", "startups", "jobs"],
    coverImage: unsplash("1590602847861-f357a9332bbc"),
    embedUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    durationSec: 2610,
    author: { name: "Gaurav Sharma" },
    publishedAt: daysAgo(12, 6, 0),
    readTimeMin: 43,
  },
];

export const mockPosts: Post[] = seeds.map((s) => ({
  ...s,
  standfirst: standfirsts[s.id],
  body: bodies[s.id],
  expiresAt: addDays(s.publishedAt, EXPIRY_DAYS),
}));

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const byNewest = (a: Post, b: Post) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

export function getAllPosts(): Post[] {
  return [...mockPosts].sort(byNewest);
}

export function getLatestPosts(n: number): Post[] {
  return getAllPosts().slice(0, n);
}

export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((p) => p.featured);
}

export function getBreakingPosts(): Post[] {
  return getAllPosts().filter((p) => p.isBreaking);
}

export function getPostsByType(type: PostType): Post[] {
  return getAllPosts().filter((p) => p.type === type);
}

export function getPostBySlug(slug: string): Post | undefined {
  return mockPosts.find((p) => p.slug === slug);
}
