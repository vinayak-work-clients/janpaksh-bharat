import type { Metadata } from "next";
import { terms } from "@/data/legal";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: terms.title, description: terms.intro };

export default function TermsPage() {
  return <LegalPage doc={terms} />;
}
