"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/admin/ui/Dialog";

/**
 * Warns before leaving the editor with unsaved changes: `beforeunload` for
 * reloads/closes, and a capture-phase click handler for in-app links (the
 * app router has no navigation events). Programmatic `router.push` after a
 * successful save is not intercepted, so callers reset the form first.
 */
export function UnsavedChangesGuard({ dirty }: { dirty: boolean }) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      e.preventDefault();
      e.stopPropagation();
      setPendingHref(url.pathname + url.search + url.hash);
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);

  return (
    <ConfirmDialog
      open={Boolean(pendingHref)}
      onOpenChange={(o) => !o && setPendingHref(null)}
      title="Leave without saving?"
      description="You have unsaved changes. If you leave now they'll be lost (a local backup is kept for a while, but don't rely on it)."
      confirmLabel="Leave page"
      cancelLabel="Keep editing"
      onConfirm={() => {
        const href = pendingHref;
        setPendingHref(null);
        if (href) router.push(href);
      }}
    />
  );
}
