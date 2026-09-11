export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
}

export interface LegalDoc {
  title: string;
  titleHindi: string;
  intro: string;
  lastUpdated: string; // ISO date
  sections: LegalSection[];
}

const PLACEHOLDER = "This is placeholder text for design and layout purposes. It is not legal advice and will be replaced by reviewed policy language before launch.";

export const privacy: LegalDoc = {
  title: "Privacy Policy",
  titleHindi: "गोपनीयता नीति",
  intro: "How Janpaksh Bharat collects, uses and protects information about readers, sources and community members.",
  lastUpdated: "2026-09-01",
  sections: [
    { id: "scope", title: "1. Scope", paragraphs: [PLACEHOLDER, "This policy applies to janpakshbharat.com, our WhatsApp community, newsletters and any service that links to it. It does not cover third-party platforms — Spotify, YouTube, Instagram — where our content also appears; their own policies govern those."] },
    { id: "collect", title: "2. What we collect", paragraphs: ["We collect only what a newsroom needs to function:"], list: ["Contact details you give us when you write in, tip us or subscribe", "Basic analytics: pages viewed, approximate region, device type — aggregated, never sold", "Messages and attachments you send through the contact form or WhatsApp", "Technical logs kept for security for up to 30 days"] },
    { id: "sources", title: "3. Sources and tips", paragraphs: ["Source protection is the foundation of our work. Information identifying a tipster is stored separately from editorial systems, accessible only to the editor handling the story, and deleted on request or when the story archives — whichever comes first.", PLACEHOLDER] },
    { id: "use", title: "4. How we use information", paragraphs: ["To reply to you, to send the alerts you asked for, to understand which stories readers value, and to keep the site secure. We do not build advertising profiles and we do not share personal data with sponsors."] },
    { id: "cookies", title: "5. Cookies", paragraphs: ["We use a session flag to play the intro animation once and privacy-respecting analytics that do not track you across sites. You can block cookies in your browser; the site will still work.", PLACEHOLDER] },
    { id: "retention", title: "6. Retention and archiving", paragraphs: ["Stories archive 30 days after publication. Contact-form submissions are kept for 12 months unless you ask us to delete them sooner. Analytics are aggregated after 90 days."] },
    { id: "rights", title: "7. Your rights", paragraphs: ["You may ask what we hold about you, ask us to correct or delete it, or withdraw consent to alerts at any time. Write to the desk using the contact page; we respond within 30 days."] },
    { id: "contact", title: "8. Contact", paragraphs: ["Questions about this policy go to the CEO's office via the contact page or the email listed in the footer."] },
  ],
};

export const terms: LegalDoc = {
  title: "Terms of Use",
  titleHindi: "उपयोग की शर्तें",
  intro: "The rules for reading, sharing and reusing Janpaksh Bharat's journalism.",
  lastUpdated: "2026-09-01",
  sections: [
    { id: "acceptance", title: "1. Acceptance", paragraphs: ["By using this site you agree to these terms. If you do not agree, please do not use the site.", PLACEHOLDER] },
    { id: "content", title: "2. Our content", paragraphs: ["Text, photographs, video and audio published here are the copyright of Janpaksh Bharat or licensed from their creators. Stock imagery is used under licence from Unsplash and its photographers."] },
    { id: "sharing", title: "3. Sharing and quoting", paragraphs: ["You may share links freely and quote up to 150 words with attribution and a link back. Republishing full stories, video or audio requires written permission — ask via the contact page; we say yes more often than not."] },
    { id: "archive", title: "4. The 30-day archive", paragraphs: ["Stories leave the live site 30 days after publication. Archived stories remain available for research, legal and citation requests. Links to archived stories may return a 'not found' page.", PLACEHOLDER] },
    { id: "corrections", title: "5. Corrections and complaints", paragraphs: ["We correct material errors at the top of the story, with a date. To request a correction, use the contact page and quote the headline. Unresolved complaints may be escalated to the Editor-in-Chief."] },
    { id: "conduct", title: "6. Community conduct", paragraphs: ["Our WhatsApp community is moderated. Harassment, hate speech, spam and unverified 'forwards' result in removal without notice."] },
    { id: "liability", title: "7. Liability", paragraphs: [PLACEHOLDER, "We work hard to be accurate but cannot guarantee that every story is free of error at every moment. Content is provided for information, not as professional advice."] },
    { id: "changes", title: "8. Changes to these terms", paragraphs: ["We may update these terms. The date at the top tells you when we last did. Continued use after a change means you accept it."] },
  ],
};
