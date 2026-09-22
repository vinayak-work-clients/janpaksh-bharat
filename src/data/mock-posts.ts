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
    section: "politics",
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
    section: "business",
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
    section: "national",
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
    section: "national",
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
    section: "uttar-pradesh",
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
    section: "delhi-ncr",
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
    section: "sports",
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
    section: "national",
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
    section: "politics",
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
    section: "business",
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
    section: "uttar-pradesh",
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
    section: "national",
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
    section: "business",
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
    section: "national",
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
    section: "national",
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
    section: "sports",
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
    section: "politics",
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
    section: "business",
    category: "Economy",
    tags: ["podcast", "startups", "jobs"],
    coverImage: unsplash("1590602847861-f357a9332bbc"),
    embedUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    durationSec: 2610,
    author: { name: "Gaurav Sharma" },
    publishedAt: daysAgo(12, 6, 0),
    readTimeMin: 43,
  },
  /* ============================ PHASE 4.5 ============================ */
  /* ----------------------------- UTTARAKHAND ---------------------------- */
  {
    id: "p19",
    slug: "char-dham-yatra-paused-red-alert-rudraprayag-chamoli",
    type: "breaking",
    title: "Char Dham yatra paused for 48 hours as IMD issues red alert for Rudraprayag and Chamoli",
    titleHindi: "रुद्रप्रयाग-चमोली में रेड अलर्ट, चारधाम यात्रा 48 घंटे के लिए रोकी गई",
    excerpt:
      "Pilgrims bound for Kedarnath and Badrinath are being held at Sonprayag and Joshimath after the Met office forecast extremely heavy rain over the upper valleys.",
    section: "uttarakhand",
    category: "Environment",
    tags: ["char-dham", "imd", "rudraprayag", "chamoli"],
    coverImage: unsplash("1519681393784-d120267933ba"),
    author: { name: "Deepak Rawat" },
    publishedAt: daysAgo(0, 6, 40),
    isBreaking: true,
    readTimeMin: 2,
  },
  {
    id: "p20",
    slug: "dehradun-lychee-orchards-gated-colonies",
    type: "image",
    title: "Dehradun's last lychee orchards are turning into gated colonies",
    titleHindi: "देहरादून के आख़िरी लीची बाग़ अब गेटेड कॉलोनियाँ बन रहे हैं",
    excerpt:
      "The valley once sent lychees to Lahore and Lucknow. This season fewer than 900 acres remain under fruit, and most of it is for sale.",
    section: "uttarakhand",
    category: "Environment",
    tags: ["dehradun", "land", "agriculture"],
    coverImage: unsplash("1470071459604-3b5ec3a7fe05"),
    author: { name: "Deepak Rawat" },
    publishedAt: daysAgo(2, 8, 30),
    featured: true,
    readTimeMin: 6,
  },
  {
    id: "p21",
    slug: "haridwar-har-ki-pauri-crowd-count-kumbh",
    type: "image",
    title: "Haridwar installs a crowd-count system at Har Ki Pauri ahead of Kumbh 2027",
    titleHindi: "कुंभ 2027 से पहले हर की पौड़ी पर भीड़ गिनने की व्यवस्था",
    excerpt:
      "Forty cameras and a control room will estimate footfall on the ghats every minute. Pandas and boatmen want to know who gets the number first.",
    section: "uttarakhand",
    category: "Society",
    tags: ["haridwar", "kumbh", "crowd-safety"],
    coverImage: unsplash("1596402184320-417e7178b2cd"),
    author: { name: "Anupam Joshi" },
    publishedAt: daysAgo(4, 11, 0),
    readTimeMin: 5,
  },
  {
    id: "p22",
    slug: "nainital-is-running-out-of-lake",
    type: "blog",
    title: "Nainital is running out of lake",
    titleHindi: "नैनीताल की झील सूखती जा रही है",
    excerpt:
      "The Naini lake fell to its lowest pre-monsoon level in two decades this year. The town's water, tourism and property market all depend on a number nobody is measuring properly.",
    section: "uttarakhand",
    category: "Environment",
    tags: ["nainital", "water", "tourism"],
    coverImage: unsplash("1476514525535-07fb3b4ae5f1"),
    author: { name: "Kavita Negi" },
    publishedAt: daysAgo(6, 9, 15),
    readTimeMin: 8,
  },
  {
    id: "p23",
    slug: "video-road-to-kedarnath-one-year-after-rebuild",
    type: "video",
    title: "Ground report: the road to Kedarnath, one year after the rebuild",
    titleHindi: "ग्राउंड रिपोर्ट: पुनर्निर्माण के एक साल बाद केदारनाथ की सड़क",
    excerpt:
      "Sixteen kilometres from Gaurikund to the shrine, on foot, with the mule operators, porters and engineers who keep the route open.",
    section: "uttarakhand",
    category: "Society",
    tags: ["kedarnath", "infrastructure", "documentary"],
    coverImage: unsplash("1476231682828-37e571bc172f"),
    mediaUrl: `${GVIDEO}/ForBiggerJoyrides.mp4`,
    durationSec: 415,
    author: { name: "Tenzin Dolma" },
    publishedAt: daysAgo(8, 17, 0),
    readTimeMin: 7,
  },

  /* ---------------------------- UTTAR PRADESH --------------------------- */
  {
    id: "p24",
    slug: "lucknow-chikankari-gi-tag-artisan-wages",
    type: "image",
    title: "Lucknow's chikankari gets a GI-tag makeover. The women who stitch it want wages first",
    titleHindi: "लखनऊ की चिकनकारी को जीआई टैग का नया रूप, कारीगर पहले मज़दूरी चाहती हैं",
    excerpt:
      "A ₹120-crore cluster scheme promises design studios and export fairs. In the mohallas of old Lucknow, a kurta still earns the embroiderer ₹40.",
    section: "uttar-pradesh",
    category: "Culture",
    tags: ["lucknow", "crafts", "labour"],
    coverImage: unsplash("1524230572899-a752b3835840"),
    author: { name: "Aditya Tripathi" },
    publishedAt: daysAgo(1, 13, 0),
    featured: true,
    readTimeMin: 6,
  },
  {
    id: "p25",
    slug: "noida-film-city-ground-breaking-farmers-waiting",
    type: "image",
    title: "Noida's film city finally breaks ground. The farmers next door are still waiting for their cheques",
    titleHindi: "नोएडा फ़िल्म सिटी का काम शुरू, पड़ोस के किसान अब भी मुआवज़े के इंतज़ार में",
    excerpt:
      "The 230-acre first phase along the Yamuna Expressway was inaugurated on Tuesday. Enhanced compensation for six villages has been in litigation since 2019.",
    section: "uttar-pradesh",
    category: "Society",
    tags: ["noida", "land", "film-city"],
    coverImage: unsplash("1486406146926-c627a92ad1ab"),
    author: { name: "Rohan Bhattacharya" },
    publishedAt: daysAgo(3, 10, 30),
    readTimeMin: 5,
  },
  {
    id: "p26",
    slug: "kanpur-tanneries-clean-up-or-close-three-years-on",
    type: "blog",
    title: "Kanpur's tanneries were told to clean up or close. Three years on, they did neither",
    titleHindi: "कानपुर की टेनरियों को सफ़ाई या बंदी का आदेश था, तीन साल बाद दोनों नहीं हुए",
    excerpt:
      "The common effluent plant runs at a third of capacity, the Ganga downstream still fails the bathing standard, and 40,000 jobs sit in the gap between the two.",
    section: "uttar-pradesh",
    category: "Environment",
    tags: ["kanpur", "ganga", "industry"],
    coverImage: unsplash("1513828583688-c52646db42da"),
    author: { name: "Vikram Chauhan" },
    publishedAt: daysAgo(7, 10, 0),
    readTimeMin: 9,
  },

  /* ------------------------------ DELHI-NCR ----------------------------- */
  {
    id: "p27",
    slug: "gurugram-metro-corridor-drainage-plan",
    type: "image",
    title: "Gurugram's new metro corridor: 28 km, 27 stations and a drainage plan nobody has seen",
    titleHindi: "गुरुग्राम का नया मेट्रो कॉरिडोर: 28 किमी, 27 स्टेशन और एक अनदेखा ड्रेनेज प्लान",
    excerpt:
      "Piling for the Old Gurugram loop began this month. Residents along the route want to know how the pillars will sit on roads that already flood every July.",
    section: "delhi-ncr",
    category: "Society",
    tags: ["gurugram", "metro", "infrastructure"],
    coverImage: unsplash("1449824913935-59a10b8d2000"),
    author: { name: "Rohan Bhattacharya" },
    publishedAt: daysAgo(3, 8, 0),
    readTimeMin: 5,
  },
  {
    id: "p28",
    slug: "delhi-winter-air-plan-same-as-last-year",
    type: "blog",
    title: "Delhi's winter air plan is the same as last year's. Here is what changed anyway",
    titleHindi: "दिल्ली का सर्दियों का वायु प्लान पिछले साल जैसा ही है, फिर भी क्या बदला",
    excerpt:
      "The graded response plan has not been rewritten since 2023. The stubble map, the truck count and the number of monitors have — and that is where the story is.",
    section: "delhi-ncr",
    category: "Environment",
    tags: ["delhi", "air-quality", "grap"],
    coverImage: unsplash("1480714378408-67cf0d13bc1b"),
    author: { name: "Kabir Anand" },
    publishedAt: daysAgo(5, 9, 0),
    readTimeMin: 7,
  },
  {
    id: "p29",
    slug: "podcast-janpaksh-ep-13-who-owns-delhis-colonies",
    type: "podcast",
    title: "Janpaksh Podcast Ep. 13 — Who owns Delhi's colonies?",
    titleHindi: "जनपक्ष पॉडकास्ट अंक 13 — दिल्ली की कॉलोनियों का मालिक कौन?",
    excerpt:
      "Urban planner Meenakshi Sahni on the 1,700 unauthorised colonies, the regularisation that never finishes, and the four million people living in the paperwork.",
    section: "delhi-ncr",
    category: "Politics",
    tags: ["podcast", "delhi", "housing"],
    coverImage: unsplash("1524492412937-b28074a5d7da"),
    mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    durationSec: 2760,
    author: { name: "Gaurav Sharma" },
    publishedAt: daysAgo(9, 6, 0),
    readTimeMin: 46,
  },

  /* ---------------------------- INTERNATIONAL --------------------------- */
  {
    id: "p30",
    slug: "dhaka-garment-workers-minimum-wage-overtime",
    type: "image",
    title: "Dhaka's garment workers win a 56% minimum wage rise — and lose their overtime",
    titleHindi: "ढाका के गारमेंट मज़दूरों को 56% वेतन वृद्धि मिली, ओवरटाइम छिना",
    excerpt:
      "Factories supplying Indian and European brands are cutting shifts to absorb the new floor. Workers say the take-home pay has barely moved.",
    section: "international",
    category: "Economy",
    tags: ["bangladesh", "labour", "textiles"],
    coverImage: unsplash("1558769132-cb1aea458c5e"),
    author: { name: "Fatima Sheikh" },
    publishedAt: daysAgo(1, 15, 0),
    readTimeMin: 6,
  },
  {
    id: "p31",
    slug: "colombo-port-deal-explained-india-china",
    type: "blog",
    title: "The Colombo port deal, explained: what India gets and what China keeps",
    titleHindi: "कोलंबो बंदरगाह समझौता: भारत को क्या मिला, चीन के पास क्या रहा",
    excerpt:
      "A 35-year terminal concession, a debt swap and a rule about warships. The fine print matters more than the headline.",
    section: "international",
    category: "Politics",
    tags: ["sri-lanka", "ports", "diplomacy"],
    coverImage: unsplash("1578575437130-527eed3abbec"),
    author: { name: "Priya Raghunathan" },
    publishedAt: daysAgo(4, 12, 0),
    readTimeMin: 8,
  },
  {
    id: "p32",
    slug: "video-kathmandu-new-airport-half-empty-sky",
    type: "video",
    title: "Kathmandu's new airport opens to a half-empty sky",
    titleHindi: "काठमांडू का नया हवाई अड्डा खुला, आसमान आधा खाली",
    excerpt:
      "Nepal built a second international gateway to bring in tourists from India and China. Five months on, most flights still land at the old one.",
    section: "international",
    category: "Economy",
    tags: ["nepal", "aviation", "tourism"],
    coverImage: unsplash("1500595046743-cd271d694d30"),
    mediaUrl: `${GVIDEO}/ForBiggerMeltdowns.mp4`,
    durationSec: 302,
    author: { name: "Tenzin Dolma" },
    publishedAt: daysAgo(6, 18, 0),
    readTimeMin: 5,
  },
  {
    id: "p33",
    slug: "dubai-remittance-queues-counters-to-kiosks",
    type: "image",
    title: "In Dubai, the Indian remittance queue is moving from counters to kiosks",
    titleHindi: "दुबई में भारतीय रेमिटेंस की कतार काउंटर से किओस्क की ओर",
    excerpt:
      "Exchange houses in Deira are replacing tellers with machines that read an Emirates ID and a UPI handle. The Friday-night crowd has thoughts.",
    section: "international",
    category: "Technology",
    tags: ["uae", "remittances", "upi"],
    coverImage: unsplash("1512453979798-5ea266f8880c"),
    author: { name: "Arjun Mehta" },
    publishedAt: daysAgo(11, 10, 0),
    readTimeMin: 5,
  },

  /* ------------------------------- POLITICS ----------------------------- */
  {
    id: "p34",
    slug: "six-state-elections-freebie-guidelines-teeth",
    type: "blog",
    title: "Six state elections, one question: do the new freebie guidelines have any teeth?",
    titleHindi: "छह राज्यों के चुनाव, एक सवाल: क्या 'मुफ़्त' पर नए दिशानिर्देशों में कोई दम है?",
    excerpt:
      "The Election Commission now asks parties to cost their promises. We read all 41 manifestos filed so far. Four did the maths.",
    section: "politics",
    category: "Politics",
    tags: ["elections", "manifestos", "eci"],
    coverImage: unsplash("1450101499163-c8848c66ca85"),
    author: { name: "Priya Raghunathan" },
    publishedAt: daysAgo(2, 11, 0),
    readTimeMin: 7,
  },

  /* -------------------------------- SPORTS ------------------------------ */
  {
    id: "p35",
    slug: "kabaddi-pro-league-broadcast-deal-bigger-than-hockey",
    type: "image",
    title: "Kabaddi's pro league signs a broadcast deal bigger than hockey's",
    titleHindi: "कबड्डी लीग का प्रसारण सौदा हॉकी से भी बड़ा",
    excerpt:
      "A five-year rights agreement values the league at ₹1,100 crore. The players, most of them from villages in Haryana and UP, will see a fraction of it.",
    section: "sports",
    category: "Sports",
    tags: ["kabaddi", "broadcast", "leagues"],
    coverImage: unsplash("1461896836934-ffe607ba8211"),
    author: { name: "Sneha Iyer" },
    publishedAt: daysAgo(3, 19, 0),
    readTimeMin: 4,
  },
  {
    id: "p36",
    slug: "marathon-boom-tier-two-cities-physios",
    type: "blog",
    title: "The marathon boom in tier-2 cities is real. The physios can't keep up",
    titleHindi: "छोटे शहरों में मैराथन का उछाल असली है, फ़िज़ियो पीछे छूट रहे हैं",
    excerpt:
      "Indore, Kochi and Dehradun each sold out a half-marathon this season. Sports-injury clinics outside the metros can be counted on one hand.",
    section: "sports",
    category: "Sports",
    tags: ["running", "fitness", "health"],
    coverImage: unsplash("1552674605-db6ffd4facb5"),
    author: { name: "Sneha Iyer" },
    publishedAt: daysAgo(8, 7, 30),
    readTimeMin: 6,
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

/** All posts in a section (live or archived), newest first. */
export function getPostsBySection(slug: string): Post[] {
  return getAllPosts().filter((p) => p.section === slug);
}
