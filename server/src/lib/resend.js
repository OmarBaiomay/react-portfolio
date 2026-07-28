import { Resend } from 'resend';

const SERVICE_LABELS = {
  web: 'Web Development',
  odoo: 'Odoo Development',
  software: 'Custom Software',
  other: 'Other',
};

let client;

function getClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function serviceLabel(service) {
  return SERVICE_LABELS[service] || service || 'General inquiry';
}

function shell({ title, eyebrow, bodyHtml, footerNote }) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f4f4f5;font-family:Manrope,Arial,Helvetica,sans-serif;color:#111;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e4e4e7;">
      <div style="background:#050505;color:#ffffff;padding:22px 24px;">
        <p style="margin:0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.72;">${escapeHtml(eyebrow || 'B-Code')}</p>
        <h1 style="margin:10px 0 0;font-size:22px;line-height:1.25;font-weight:700;">${escapeHtml(title)}</h1>
      </div>
      <div style="padding:24px;">
        ${bodyHtml}
      </div>
      <div style="padding:16px 24px 22px;border-top:1px solid #f0f0f1;background:#fafafa;">
        <p style="margin:0;font-size:12px;line-height:1.55;color:#71717a;">
          ${footerNote || 'B-Code · Software that moves business forward · <a href="https://b-code.tech" style="color:#e04a0c;text-decoration:none;">b-code.tech</a>'}
        </p>
      </div>
    </div>
  </body>
</html>`;
}

function detailRows(rows) {
  return `<table style="width:100%;border-collapse:collapse;margin:0 0 20px;">
    ${rows
      .map(
        ([label, value]) => `<tr>
      <td style="padding:9px 0;border-bottom:1px solid #eee;color:#71717a;font-size:13px;width:118px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:9px 0;border-bottom:1px solid #eee;color:#111;font-size:14px;font-weight:500;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`
      )
      .join('')}
  </table>`;
}

/** Admin inbox — new lead from website */
export function buildAdminLeadSubject(lead) {
  return `New lead: ${lead.name} — ${serviceLabel(lead.service)}`;
}

export function buildAdminLeadPreview(lead) {
  return `${lead.name} inquired about ${serviceLabel(lead.service)}. Reply within 24 hours.`;
}

export function buildAdminLeadHtml(lead) {
  const service = serviceLabel(lead.service);
  const bodyHtml = `
    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#3f3f46;">
      A new inquiry just arrived from the website contact form.
    </p>
    ${detailRows([
      ['Name', lead.name],
      ['Email', lead.email],
      ['Phone', lead.phone],
      ['WhatsApp', lead.whatsapp],
      ['Need', service],
      ['Source', lead.source || 'website'],
    ])}
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#71717a;">Message</p>
    <div style="padding:14px 16px;background:#fafafa;border:1px solid #eee;border-radius:10px;color:#18181b;font-size:14px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(lead.message || '')}</div>
    <p style="margin:18px 0 0;font-size:12px;color:#a1a1aa;">Lead ID: ${escapeHtml(lead.id)}</p>
  `;

  return shell({
    title: 'New website lead',
    eyebrow: 'B-Code Admin',
    bodyHtml,
    footerNote:
      'Open this lead in the admin dashboard · <a href="https://app.b-code.tech/leads" style="color:#e04a0c;text-decoration:none;">app.b-code.tech/leads</a>',
  });
}

/** Customer confirmation — we received your request */
export function buildCustomerConfirmSubject() {
  return 'We received your request — B-Code';
}

export function buildCustomerConfirmPreview(lead) {
  return `Thanks ${lead.name}. Our team will reply within 24 hours.`;
}

export function buildCustomerConfirmHtml(lead) {
  const service = serviceLabel(lead.service);
  const firstName = String(lead.name || '').trim().split(/\s+/)[0] || 'there';

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#3f3f46;">
      Hi ${escapeHtml(firstName)},
    </p>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:#3f3f46;">
      Thanks for reaching out to <strong style="color:#111;">B-Code</strong>. We received your message about
      <strong style="color:#111;">${escapeHtml(service)}</strong> and will get back to you within
      <strong style="color:#111;">24 hours</strong>.
    </p>
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#71717a;">Your request</p>
    <div style="padding:14px 16px;background:#fafafa;border:1px solid #eee;border-radius:10px;margin-bottom:18px;">
      ${detailRows([
        ['Name', lead.name],
        ['Email', lead.email],
        ['Phone', lead.phone],
        ['Need', service],
      ])}
      <p style="margin:0 0 6px;font-size:12px;color:#71717a;">Message</p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#18181b;white-space:pre-wrap;">${escapeHtml(lead.message || '')}</p>
    </div>
    <p style="margin:0;font-size:15px;line-height:1.65;color:#3f3f46;">
      If anything is urgent, reply to this email or WhatsApp us on the number you shared.
    </p>
  `;

  return shell({
    title: 'We got your message',
    eyebrow: 'B-Code',
    bodyHtml,
    footerNote:
      'B-Code · <a href="https://b-code.tech" style="color:#e04a0c;text-decoration:none;">b-code.tech</a> · You received this because you submitted the contact form.',
  });
}

async function sendOne({ resend, from, to, subject, html, replyTo, preview }) {
  const payload = {
    from,
    to,
    subject,
    html,
  };
  if (replyTo) payload.replyTo = replyTo;
  if (preview) payload.text = preview;

  const { data, error } = await resend.emails.send(payload);
  if (error) {
    console.error('[resend] send failed:', error.message || error);
    return { ok: false, error };
  }
  return { ok: true, id: data?.id };
}

/**
 * Admin notification + customer confirmation after a public lead is created.
 * Non-blocking — callers should not fail the HTTP request if email fails.
 */
export async function sendLeadEmails(lead) {
  const resend = getClient();
  const adminTo = process.env.LEAD_NOTIFY_EMAIL || 'baiomayomar@gmail.com';
  const from = process.env.RESEND_FROM || 'B-Code <notification@b-code.tech>';

  if (!resend) {
    console.warn('[resend] RESEND_API_KEY not set — skipping lead emails');
    return { ok: false, skipped: true };
  }

  try {
    const [admin, customer] = await Promise.all([
      sendOne({
        resend,
        from,
        to: adminTo,
        subject: buildAdminLeadSubject(lead),
        html: buildAdminLeadHtml(lead),
        replyTo: lead.email,
        preview: buildAdminLeadPreview(lead),
      }),
      sendOne({
        resend,
        from,
        to: lead.email,
        subject: buildCustomerConfirmSubject(),
        html: buildCustomerConfirmHtml(lead),
        replyTo: adminTo,
        preview: buildCustomerConfirmPreview(lead),
      }),
    ]);

    return { ok: admin.ok || customer.ok, admin, customer };
  } catch (err) {
    console.error('[resend] lead emails error:', err.message);
    return { ok: false, error: err.message };
  }
}

/** @deprecated use sendLeadEmails */
export async function sendLeadNotificationEmail(lead) {
  return sendLeadEmails(lead);
}
