"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Card } from "@/components/admin/ui/Card";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Button } from "@/components/admin/ui/Button";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card>
      <EmptyState
        icon={<AlertTriangle />}
        title="That didn't load"
        description={
          <>
            Something went wrong on our side. Your work is safe: nothing was changed. Try again, or go back to the overview.
            {error.digest && <span className="mt-2 block text-[0.75rem] text-muted/70">Reference {error.digest}</span>}
          </>
        }
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={reset}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Try again
            </Button>
            <Button href="/admin" variant="ghost">
              Overview
            </Button>
          </div>
        }
      />
    </Card>
  );
}
