import type { TeamMember } from "@/types/content";
import { siteConfig } from "@/config/site";

const portrait = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

export const team: TeamMember[] = [
  {
    slug: "gaurav-sharma",
    name: siteConfig.contact.name,
    role: "CEO & Founder",
    bio: "Gaurav started Janpaksh Bharat from a WhatsApp group in Uttarakhand with one rule: go to the place before you write about it. He still edits the breaking desk most mornings and hosts the Sunvai podcast.",
    photo: portrait("1545167622-3a6ac756afa4"),
    email: siteConfig.contact.email,
    phone: siteConfig.contact.phone,
    socials: { x: "#", instagram: "#", linkedin: "#" },
  },
  {
    slug: "meera-rathore",
    name: "Meera Rathore",
    role: "Editor-in-Chief",
    bio: "Fifteen years across two Hindi dailies and a wire service. Meera runs the desk, signs off every correction and insists that a story is not finished until the person it is about has read it.",
    photo: portrait("1605993439219-9d09d2020fa5"),
    socials: { x: "#", linkedin: "#" },
  },
  {
    slug: "debojyoti-sen",
    name: "Debojyoti Sen",
    role: "Head of Video",
    bio: "Documentary filmmaker turned newsroom lead. Debojyoti shoots most of our long-form films himself and trains district stringers to send usable footage from a phone.",
    photo: portrait("1595152772835-219674b2a8a6"),
    socials: { instagram: "#", x: "#" },
  },
  {
    slug: "fatima-sheikh",
    name: "Fatima Sheikh",
    role: "Podcast Producer",
    bio: "Fatima produces Janpaksh Sunvai end to end — research, booking, edit and mix. Before this she made radio features on labour and migration for a public broadcaster.",
    photo: portrait("1607746882042-944635dfe10e"),
    socials: { x: "#", linkedin: "#" },
  },
  {
    slug: "kabir-anand",
    name: "Kabir Anand",
    role: "Political Correspondent",
    bio: "Kabir covers Parliament, the Election Commission and the state capitals of the Hindi belt. He would rather read a committee report than a press release, and it shows.",
    photo: portrait("1566492031773-4f4e44671857"),
    socials: { x: "#" },
  },
  {
    slug: "ananya-bose",
    name: "Ananya Bose",
    role: "Design Lead",
    bio: "Ananya designed this site, our WhatsApp templates and the show art. She thinks a hairline rule is a design decision and that most news sites have too many buttons.",
    photo: portrait("1611348586804-61bf6c080437"),
    socials: { instagram: "#", linkedin: "#" },
  },
];

export function getTeamMember(slug: string) {
  return team.find((m) => m.slug === slug);
}
