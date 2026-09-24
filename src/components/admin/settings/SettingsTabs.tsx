"use client";

import { useCallback, useMemo, useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import { SETTINGS_TABS, type SettingsFormValues, type SettingsTab } from "@/lib/admin/schemas";
import { Card } from "@/components/admin/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/Tabs";
import { UnsavedChangesGuard } from "@/components/admin/posts/UnsavedChangesGuard";
import { TabForm } from "@/components/admin/settings/TabForm";
import { BrandTab } from "@/components/admin/settings/BrandTab";
import { ContactTab, PodcastTab, SocialTab } from "@/components/admin/settings/SimpleTabs";
import { CleanupPanel, SiteTab } from "@/components/admin/settings/SiteTab";

const LABEL: Record<SettingsTab, string> = { brand: "Brand", contact: "Contact", social: "Social & CTAs", podcast: "Podcast", site: "Site" };

interface SettingsTabsProps {
  initial: SettingsFormValues;
  updatedAt: string | null;
  initialTab?: SettingsTab;
}

export function SettingsTabs({ initial, updatedAt, initialTab = "brand" }: SettingsTabsProps) {
  const [dirty, setDirty] = useState<Record<SettingsTab, boolean>>({ brand: false, contact: false, social: false, podcast: false, site: false });
  const onDirty = useCallback((tab: SettingsTab, d: boolean) => setDirty((s) => (s[tab] === d ? s : { ...s, [tab]: d })), []);
  const anyDirty = useMemo(() => Object.values(dirty).some(Boolean), [dirty]);

  return (
    <Card
      flush
      action={updatedAt ? <span className="font-sans text-[0.75rem] text-muted">Last saved {formatDate(updatedAt, "d MMM yyyy, HH:mm")}</span> : undefined}
      title="Site settings"
    >
      <UnsavedChangesGuard dirty={anyDirty} />
      <Tabs defaultValue={initialTab}>
        <div className="overflow-x-auto px-3 pt-2 sm:px-5">
          <TabsList className="min-w-[32rem]">
            {SETTINGS_TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="whitespace-nowrap">
                {LABEL[tab]}
                <span aria-label={dirty[tab] ? "Unsaved changes" : undefined} className={cn("h-1.5 w-1.5 rounded-full bg-saffron transition-opacity", dirty[tab] ? "opacity-100" : "opacity-0")} />
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {SETTINGS_TABS.map((tab) => (
          <TabsContent key={tab} value={tab} forceMount className="px-4 py-5 data-[state=inactive]:hidden sm:px-5">
            <TabForm tab={tab} label={LABEL[tab]} initial={initial} onDirty={onDirty}>
              {(form) =>
                tab === "brand" ? <BrandTab form={form} /> : tab === "contact" ? <ContactTab form={form} /> : tab === "social" ? <SocialTab form={form} /> : tab === "podcast" ? <PodcastTab form={form} /> : <SiteTab form={form} />
              }
            </TabForm>
            {tab === "site" && (
              <div className="mt-6">
                <CleanupPanel />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
