/**
 * ─────────────────────────────────────────────────────────────
 * EMAIL SERVICE — Resend (via REST, zero SDK weight)
 * ─────────────────────────────────────────────────────────────
 * Production: set RESEND_API_KEY + CONFIRM_EMAIL_FROM and every
 * mail is delivered by Resend (EU data residency, UK-friendly).
 *
 * Demo: with no API key configured the service runs in "dev"
 * mode — nothing is sent, and the API returns the exact email
 * HTML + live confirmation link so the full double opt-in flow
 * can be walked through in the browser.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

interface MailArgs {
  to: string;
  subject: string;
  html: string;
  unsubscribeUrl?: string;
  /** RFC 8058 one-click unsubscribe POST endpoint */
  oneClickPostUrl?: string;
}

async function send(args: MailArgs): Promise<boolean> {
  if (!emailConfigured()) return false;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    "Content-Type": "application/json",
  };

  const payload: Record<string, unknown> = {
    from: process.env.CONFIRM_EMAIL_FROM ?? "Lyria <hello@lyriahealth.co.uk>",
    to: [args.to],
    subject: args.subject,
    html: args.html,
    headers: {
      "List-Unsubscribe": `<${args.unsubscribeUrl ?? ""}>`,
      "List-Unsubscribe-Post": args.oneClickPostUrl
        ? `List-Unsubscribe=One-Click`
        : undefined,
    },
  };

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* ─────────────────────────────────────────────
   Branded email templates (inline styles only,
   for maximum client compatibility)
   ───────────────────────────────────────────── */

const shell = (inner: string, unsubscribeUrl: string) => `
<!DOCTYPE html>
<html lang="en-GB">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lyria</title></head>
<body style="margin:0;padding:0;background:#f4f0e8;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f0e8;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="background:#1b2c47;padding:28px 36px;">
          <span style="font-family:Georgia,serif;font-size:22px;letter-spacing:6px;color:#f4f0e8;">LYRIA<span style="color:#c4a66b;">.</span></span><br/>
          <span style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:2.2px;text-transform:uppercase;color:#c4a66b;">Healthcare before you need it</span>
        </td></tr>
        <tr><td style="background:#fbf9f4;padding:40px 36px;font-family:Arial,sans-serif;color:#1b2c47;line-height:1.65;font-size:15px;">
          ${inner}
        </td></tr>
        <tr><td style="background:#1b2c47;padding:22px 36px;font-family:Arial,sans-serif;font-size:11px;line-height:1.7;color:#8fa0ba;">
          Lyria Health Ltd · England &amp; Wales<br/>
          Completing registration with the CQC — not yet a live clinical service.<br/>
          <a href="${unsubscribeUrl}" style="color:#c4a66b;">Unsubscribe in one click</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const button = (url: string, label: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
    <tr><td style="background:#a9823d;border-radius:4px;">
      <a href="${url}" target="_top" style="display:inline-block;padding:14px 30px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:#fbf9f4;text-decoration:none;">${label}</a>
    </td></tr>
  </table>`;

export function confirmationEmailHtml(name: string, confirmUrl: string, unsubscribeUrl: string): string {
  const first = name.split(" ")[0] || "there";
  return shell(
    `
    <p style="margin:0 0 16px;font-size:15px;">Dear ${escapeHtml(first)},</p>
    <p style="margin:0 0 16px;">Thank you for asking to join the Lyria waiting list. One step remains: please confirm this email address is yours.</p>
    <p style="margin:0 0 8px;">We ask because nobody should end up on a list they didn’t choose — confirming your address is the only way subscriptions are added.</p>
    ${button(confirmUrl, "Confirm my subscription")}
    <p style="margin:0;font-size:12px;color:#4a5872;">If the button doesn’t work, copy this link into your browser:<br/><a href="${confirmUrl}" style="color:#a9823d;word-break:break-all;">${confirmUrl}</a></p>
    <p style="margin:24px 0 0;">With warm regards,<br/><span style="font-family:Georgia,serif;font-style:italic;">The Lyria team</span></p>
    <hr style="border:none;border-top:1px solid #dcd5c4;margin:28px 0;"/>
    <p style="margin:0;font-size:11px;color:#4a5872;">You received this because someone used this address to join the Lyria waiting list at lyriahealth.co.uk. If it wasn’t you, ignore this email — nothing will be added.</p>
    `,
    unsubscribeUrl
  );
}

export function welcomeEmailHtml(name: string, unsubscribeUrl: string): string {
  const first = name.split(" ")[0] || "there";
  return shell(
    `
    <p style="margin:0 0 16px;">Dear ${escapeHtml(first)},</p>
    <p style="margin:0 0 16px;">Your subscription is confirmed — you’re on the list, and you’ll hear from us the moment your tier opens.</p>
    <p style="margin:0 0 16px;">There’s nothing else you need to do. No payment details have been taken, and none will be requested until you choose to activate a membership at launch.</p>
    <p style="margin:24px 0 0;">With warm regards,<br/><span style="font-family:Georgia,serif;font-style:italic;">The Lyria team</span></p>
    `,
    unsubscribeUrl
  );
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ─────────────────────────────────────────────
   Public API
   ───────────────────────────────────────────── */

export async function sendConfirmationEmail(args: {
  to: string;
  name: string;
  confirmUrl: string;
  unsubscribeUrl: string;
}): Promise<boolean> {
  return send({
    to: args.to,
    subject: "Confirm your subscription — Lyria waiting list",
    html: confirmationEmailHtml(args.name, args.confirmUrl, args.unsubscribeUrl),
    unsubscribeUrl: args.unsubscribeUrl,
  });
}

export async function sendWelcomeEmail(args: {
  to: string;
  name: string;
  unsubscribeUrl: string;
}): Promise<boolean> {
  return send({
    to: args.to,
    subject: "You’re on the list — welcome to Lyria",
    html: welcomeEmailHtml(args.name, args.unsubscribeUrl),
    unsubscribeUrl: args.unsubscribeUrl,
  });
}
