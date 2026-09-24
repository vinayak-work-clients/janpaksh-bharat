"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { type ReactNode, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button, type AdminButtonVariant } from "@/components/admin/ui/Button";

export const DialogRoot = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

interface DialogContentProps {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** Slide in from the left edge (mobile sidebar) instead of centring. */
  side?: "center" | "left";
  hideTitle?: boolean;
}

export function DialogContent({ title, description, children, footer, className, side = "center", hideTitle = false }: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-[90] bg-ink/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <RadixDialog.Content
        className={cn(
          "fixed z-[95] bg-paper text-ink shadow-2xl focus:outline-none",
          side === "center"
            ? "left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-rule p-6"
            : "inset-y-0 left-0 w-[min(20rem,85vw)] overflow-y-auto",
          className,
        )}
      >
        {hideTitle ? (
          <RadixDialog.Title className="sr-only">{title}</RadixDialog.Title>
        ) : (
          <RadixDialog.Title className="pr-10 font-serif text-[1.35rem] font-semibold leading-tight text-ink">{title}</RadixDialog.Title>
        )}
        {description ? (
          <RadixDialog.Description className="mt-2 font-sans text-[0.9rem] leading-relaxed text-muted">{description}</RadixDialog.Description>
        ) : (
          <RadixDialog.Description className="sr-only">{typeof title === "string" ? title : "Dialog"}</RadixDialog.Description>
        )}
        {children}
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>}
        {side === "center" && (
          <RadixDialog.Close
            aria-label="Close"
            className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </RadixDialog.Close>
        )}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" for destructive actions (red button). */
  tone?: "danger" | "primary";
  onConfirm: () => void | Promise<void>;
}

/** Confirmation before destructive actions. Awaits `onConfirm` and shows a spinner. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
}: ConfirmDialogProps) {
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const variant: AdminButtonVariant = tone === "danger" ? "danger" : "primary";

  const confirm = () => {
    setBusy(true);
    startTransition(async () => {
      try {
        await onConfirm();
      } finally {
        setBusy(false);
        onOpenChange(false);
      }
    });
  };

  return (
    <RadixDialog.Root open={open} onOpenChange={(o) => !busy && onOpenChange(o)}>
      <DialogContent
        title={title}
        description={description}
        footer={
          <>
            <RadixDialog.Close asChild>
              <Button variant="ghost" disabled={busy || pending}>
                {cancelLabel}
              </Button>
            </RadixDialog.Close>
            <Button variant={variant} onClick={confirm} loading={busy || pending} autoFocus>
              {confirmLabel}
            </Button>
          </>
        }
      />
    </RadixDialog.Root>
  );
}
