import type { Service } from "@/types/content";

export const services: Service[] = [
  {
    slug: "ground-reporting",
    title: "Ground Reporting & News Coverage",
    summary: "Reporters in the field, not on the phone. Verified, sourced coverage from districts most newsrooms never reach.",
    deliverables: [
      "On-location reporting across Uttarakhand, UP and the Hindi belt",
      "Multi-source verification and documentation",
      "Bilingual copy (Hindi + English) with photo desk",
      "Same-day turnaround for breaking developments",
    ],
    icon: "Newspaper",
  },
  {
    slug: "video-journalism",
    title: "Video Journalism & Documentaries",
    summary: "Short-form explainers to 40-minute documentaries — shot, scripted and edited by a newsroom, not an ad agency.",
    deliverables: [
      "Field crews with 4K, drone and audio kits",
      "Scripting, narration and subtitling in two languages",
      "Vertical cuts for Reels, Shorts and WhatsApp",
      "Archive-safe masters delivered with rights cleared",
    ],
    icon: "Clapperboard",
  },
  {
    slug: "podcast-production",
    title: "Podcast Production",
    summary: "From concept to distribution. We build shows people finish, with the editorial discipline of a news desk.",
    deliverables: [
      "Format development, host coaching and research",
      "Remote or in-studio recording and mixing",
      "Show notes, transcripts and episode artwork",
      "Distribution to Spotify, Apple and YouTube",
    ],
    icon: "Mic",
  },
  {
    slug: "brand-partnerships",
    title: "Brand Partnerships & Sponsored Content",
    summary: "Clearly labelled, editorially honest storytelling for organisations that want to reach an engaged Indian audience.",
    deliverables: [
      "Sponsored series and branded explainers",
      "Native placements across site, newsletter and WhatsApp",
      "Transparent labelling that protects your credibility and ours",
      "Performance reporting every fortnight",
    ],
    icon: "Handshake",
  },
  {
    slug: "event-coverage",
    title: "Event & Press Coverage",
    summary: "Conferences, launches, rallies and public hearings — covered live and packaged for the next morning.",
    deliverables: [
      "Live text and photo updates from the venue",
      "Interview desk with speakers and attendees",
      "Same-night highlight film and photo set",
      "Press-release rewriting for newsroom pickup",
    ],
    icon: "CalendarDays",
  },
  {
    slug: "public-notices",
    title: "Public Notices & Community Announcements",
    summary: "A trusted channel for panchayats, cooperatives, schools and NGOs to reach the people who need to know.",
    deliverables: [
      "Verified notices in Hindi and English",
      "Priority placement on the breaking ticker and WhatsApp",
      "Accessible formatting for low-bandwidth readers",
      "30-day live window with permanent archive on request",
    ],
    icon: "Megaphone",
  },
];
