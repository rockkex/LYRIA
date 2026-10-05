"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmailPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  html: string;
  confirmUrl: string;
}

/**
 * Demo-mode companion: renders the EXACT confirmation email that
 * a subscriber would receive (same HTML that Resend would send),
 * so the double opt-in journey can be walked end-to-end before
 * an email provider is connected. The button inside the email
 * navigates the top-level page to the live confirm endpoint.
 */
export function EmailPreviewDialog({
  open,
  onOpenChange,
  html,
  confirmUrl,
}: EmailPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-paper p-0 overflow-hidden rounded-md border-line">
        <DialogHeader className="space-y-1 border-b border-line bg-paper-raised px-5 py-4">
          <DialogTitle className="font-display text-lg text-ink">
            Confirmation email preview
          </DialogTitle>
          <DialogDescription className="text-xs text-ink-soft">
            This is the exact HTML a subscriber receives at signup. Clicking
            the gold button performs the real double opt-in.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-ink/5 px-5 py-3">
          <p className="text-[11px] leading-relaxed text-ink-soft">
            <span className="eyebrow mr-2 text-gold">Direct link</span>
            If the email frame is inconvenient, confirm here:{" "}
            <a
              href={confirmUrl}
              className="break-all underline underline-offset-2 hover:text-ink"
            >
              {confirmUrl}
            </a>
          </p>
        </div>

        <iframe
          title="Preview of the Lyria confirmation email"
          srcDoc={html}
          className="h-[480px] w-full border-0 bg-white sm:h-[540px]"
        />
      </DialogContent>
    </Dialog>
  );
}
