export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
export const PROJECT_STATUSES = ['planned', 'active', 'on_hold', 'done', 'cancelled'];
export const MILESTONE_STATUSES = ['pending', 'in_progress', 'done'];
export const TASK_STATUSES = ['todo', 'doing', 'done'];
export const QUOTE_STATUSES = ['draft', 'sent', 'accepted', 'rejected', 'expired'];
export const CONTRACT_STATUSES = ['draft', 'sent', 'signed', 'cancelled'];
export const INVOICE_STATUSES = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];

export function StatusBadge({ status, labels = {} }) {
  const color =
    {
      new: 'bg-sky-500/15 text-sky-300',
      contacted: 'bg-indigo-500/15 text-indigo-300',
      qualified: 'bg-violet-500/15 text-violet-300',
      proposal: 'bg-amber-500/15 text-amber-300',
      won: 'bg-emerald-500/15 text-emerald-300',
      lost: 'bg-rose-500/15 text-rose-300',
      planned: 'bg-slate-500/15 text-slate-300',
      active: 'bg-accent/15 text-accent',
      on_hold: 'bg-amber-500/15 text-amber-300',
      done: 'bg-emerald-500/15 text-emerald-300',
      cancelled: 'bg-rose-500/15 text-rose-300',
      pending: 'bg-slate-500/15 text-slate-300',
      in_progress: 'bg-accent/15 text-accent',
      todo: 'bg-slate-500/15 text-slate-300',
      doing: 'bg-accent/15 text-accent',
      draft: 'bg-slate-500/15 text-slate-300',
      sent: 'bg-sky-500/15 text-sky-300',
      accepted: 'bg-emerald-500/15 text-emerald-300',
      rejected: 'bg-rose-500/15 text-rose-300',
      expired: 'bg-amber-500/15 text-amber-300',
      signed: 'bg-emerald-500/15 text-emerald-300',
      paid: 'bg-emerald-500/15 text-emerald-300',
      overdue: 'bg-rose-500/15 text-rose-300',
    }[status] || 'bg-surface text-muted';

  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${color}`}>
      {labels[status] || status}
    </span>
  );
}

export function formatMoney(value, currency = 'EGP') {
  const n = Number(value) || 0;
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}`;
}

export function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return String(value);
  }
}
