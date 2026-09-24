import type { Metadata } from "next";
import { privacy } from "@/data/legal";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: privacy.title, description: privacy.intro };

export default function PrivacyPage() {
  return <LegalPage doc={privacy} />;
}
