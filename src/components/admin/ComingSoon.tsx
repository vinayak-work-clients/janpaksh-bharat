import { Construction } from "lucide-react";
import { Card } from "@/components/admin/ui/Card";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Button } from "@/components/admin/ui/Button";

/** Placeholder for the Phase 5B screens so every nav item resolves. */
export function ComingSoon({ what, detail }: { what: string; detail: string }) {
  return (
    <Card>
      <EmptyState
        icon={<Construction />}
        title={`${what} arrives in the next phase`}
        description={detail}
        action={
          <Button href="/admin/posts" variant="ghost">
            Go to posts
          </Button>
        }
      />
    </Card>
  );
}
