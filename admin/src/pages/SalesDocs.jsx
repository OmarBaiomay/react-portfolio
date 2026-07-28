import { useEffect, useMemo, useState } from 'react';
import { FilePlus2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { salesAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { formatDate, formatMoney, StatusBadge } from '../lib/crm.jsx';
import { Field, FormActions, FormCard, FormGrid, FormSection } from '../components/FormUI';

const emptyItem = () => ({ description: '', qty: 1, unitPrice: 0 });

/**
 * Shared sales documents UI for quotes | contracts | invoices
 */
const SalesDocsPage = ({ kind }) => {
  const { t } = useLanguage();
  const S = t.sales;
  const labels = S[kind];
  const statuses = S.statuses[kind];

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    status: 'draft',
    currency: 'EGP',
    tax: 0,
    notes: '',
    issueDate: new Date().toISOString().slice(0, 10),
    validUntil: '',
    dueDate: '',
    lineItems: [emptyItem()],
  });

  const listFn =
    kind === 'quotes'
      ? salesAPI.getQuotes
      : kind === 'contracts'
        ? salesAPI.getContracts
        : salesAPI.getInvoices;
  const createFn =
    kind === 'quotes'
      ? salesAPI.createQuote
      : kind === 'contracts'
        ? salesAPI.createContract
        : salesAPI.createInvoice;
  const updateFn =
    kind === 'quotes'
      ? salesAPI.updateQuote
      : kind === 'contracts'
        ? salesAPI.updateContract
        : salesAPI.updateInvoice;
  const deleteFn =
    kind === 'quotes'
      ? salesAPI.deleteQuote
      : kind === 'contracts'
        ? salesAPI.deleteContract
        : salesAPI.deleteInvoice;

  const load = async () => {
    try {
      setLoading(true);
      const params = filter ? { status: filter } : {};
      const { data } = await listFn(params);
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.response?.data?.message || S.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter, kind]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      status: 'draft',
      currency: 'EGP',
      tax: 0,
      notes: '',
      issueDate: new Date().toISOString().slice(0, 10),
      validUntil: '',
      dueDate: '',
      lineItems: [emptyItem()],
    });
    setShowForm(true);
  };

  const openEdit = (doc) => {
    setEditingId(doc.id);
    setForm({
      status: doc.status,
      currency: doc.currency || 'EGP',
      tax: doc.tax || 0,
      notes: doc.notes || '',
      issueDate: doc.issueDate ? String(doc.issueDate).slice(0, 10) : '',
      validUntil: doc.validUntil ? String(doc.validUntil).slice(0, 10) : '',
      dueDate: doc.dueDate ? String(doc.dueDate).slice(0, 10) : '',
      lineItems: doc.lineItems?.length ? doc.lineItems : [emptyItem()],
    });
    setShowForm(true);
  };

  const setLine = (index, patch) => {
    setForm((prev) => {
      const lineItems = prev.lineItems.map((row, i) => (i === index ? { ...row, ...patch } : row));
      return { ...prev, lineItems };
    });
  };

  const totals = useMemo(() => {
    const subtotal = form.lineItems.reduce(
      (sum, row) => sum + (Number(row.qty) || 0) * (Number(row.unitPrice) || 0),
      0
    );
    const tax = Number(form.tax) || 0;
    return { subtotal, tax, total: subtotal + tax };
  }, [form.lineItems, form.tax]);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tax: Number(form.tax) || 0,
        validUntil: form.validUntil || null,
        dueDate: form.dueDate || null,
        lineItems: form.lineItems.map((row) => ({
          description: row.description,
          qty: Number(row.qty) || 0,
          unitPrice: Number(row.unitPrice) || 0,
        })),
      };
      if (editingId) await updateFn(editingId, payload);
      else await createFn(payload);
      toast.success(editingId ? S.updated : S.created);
      setShowForm(false);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || S.saveError);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm(S.confirmDelete)) return;
    try {
      await deleteFn(id);
      toast.success(S.deleted);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || S.saveError);
    }
  };

  const convert = async (doc) => {
    try {
      if (kind === 'quotes') {
        await salesAPI.quoteToContract(doc.id);
        toast.success(S.convertedContract);
      } else if (kind === 'contracts') {
        await salesAPI.contractToInvoice(doc.id);
        toast.success(S.convertedInvoice);
      }
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || S.saveError);
    }
  };

  if (loading && !items.length) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const statusKeys = Object.keys(statuses || {});

  return (
    <div className="animate-slide-in">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">{labels.title}</h1>
          <p className="mt-1 text-muted">{labels.subtitle}</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          {labels.add}
        </button>
      </div>

      <div className="mb-4 max-w-xs">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="field">
          <option value="">{S.allStatuses}</option>
          {statusKeys.map((s) => (
            <option key={s} value={s}>
              {statuses[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_minmax(0,22rem)] xl:grid-cols-[1.5fr_minmax(0,24rem)]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-line/10 bg-elevated">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-line/10 bg-surface text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 text-start">{S.cols.number}</th>
                  <th className="px-4 py-3 text-start">{S.cols.status}</th>
                  <th className="px-4 py-3 text-start">{S.cols.total}</th>
                  <th className="px-4 py-3 text-start">{S.cols.date}</th>
                  <th className="px-4 py-3 text-start">{S.cols.actions}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((doc) => (
                  <tr
                    key={doc.id}
                    className={`border-b border-line/5 hover:bg-surface/50 ${
                      editingId === doc.id ? 'bg-accent/5' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openEdit(doc)}
                        className="font-medium text-ink hover:text-accent"
                      >
                        {doc.number}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={doc.status} labels={statuses} />
                    </td>
                    <td className="px-4 py-3 text-ink">{formatMoney(doc.total, doc.currency)}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(doc.issueDate)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn-ghost !py-1.5 text-xs"
                          onClick={() => openEdit(doc)}
                        >
                          {t.common.edit}
                        </button>
                        {kind === 'quotes' || kind === 'contracts' ? (
                          <button
                            type="button"
                            className="icon-btn"
                            title={kind === 'quotes' ? S.toContract : S.toInvoice}
                            onClick={() => convert(doc)}
                          >
                            <FilePlus2 className="h-4 w-4" />
                          </button>
                        ) : null}
                        <button type="button" className="icon-btn" onClick={() => onDelete(doc.id)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted">
                      {S.empty}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        {showForm ? (
          <FormCard
            title={editingId ? S.edit : labels.add}
            className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
          >
            <form onSubmit={onSave} className="space-y-4">
              <FormSection title={S.details}>
                <div className="space-y-3">
                  <Field label={S.status} required>
                    <select
                      className="field"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      {statusKeys.map((s) => (
                        <option key={s} value={s}>
                          {statuses[s]}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <FormGrid cols={2}>
                    <Field label={S.issueDate} required>
                      <input
                        type="date"
                        className="field"
                        value={form.issueDate}
                        onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                      />
                    </Field>
                    {kind === 'invoices' ? (
                      <Field label={S.dueDate}>
                        <input
                          type="date"
                          className="field"
                          value={form.dueDate}
                          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                        />
                      </Field>
                    ) : (
                      <Field label={S.validUntil}>
                        <input
                          type="date"
                          className="field"
                          value={form.validUntil}
                          onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                        />
                      </Field>
                    )}
                    <Field label={S.tax}>
                      <input
                        className="field"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.tax}
                        onChange={(e) => setForm({ ...form, tax: e.target.value })}
                      />
                    </Field>
                    <Field label={S.currency}>
                      <select
                        className="field"
                        value={form.currency}
                        onChange={(e) => setForm({ ...form, currency: e.target.value })}
                      >
                        <option value="EGP">EGP</option>
                        <option value="USD">USD</option>
                        <option value="SAR">SAR</option>
                        <option value="AED">AED</option>
                      </select>
                    </Field>
                  </FormGrid>
                </div>
              </FormSection>

              <FormSection title={S.lineItems}>
                <div className="space-y-3">
                  {form.lineItems.map((row, index) => {
                    const lineTotal = (Number(row.qty) || 0) * (Number(row.unitPrice) || 0);
                    return (
                      <div
                        key={index}
                        className="space-y-2 rounded-xl border border-line/10 bg-elevated/80 p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-muted">#{index + 1}</p>
                          <button
                            type="button"
                            className="icon-btn !h-8 !w-8 !text-rose-400"
                            aria-label={t.common.delete}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                lineItems: prev.lineItems.filter((_, i) => i !== index),
                              }))
                            }
                            disabled={form.lineItems.length <= 1}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <Field label={S.itemDesc} required>
                          <input
                            className="field"
                            value={row.description}
                            onChange={(e) => setLine(index, { description: e.target.value })}
                            required
                          />
                        </Field>
                        <FormGrid cols={2}>
                          <Field label={S.qty}>
                            <input
                              className="field"
                              type="number"
                              min="0"
                              step="1"
                              value={row.qty}
                              onChange={(e) => setLine(index, { qty: e.target.value })}
                            />
                          </Field>
                          <Field label={S.unitPrice}>
                            <input
                              className="field"
                              type="number"
                              min="0"
                              step="0.01"
                              value={row.unitPrice}
                              onChange={(e) => setLine(index, { unitPrice: e.target.value })}
                            />
                          </Field>
                        </FormGrid>
                        <p className="text-end text-sm font-semibold tabular-nums text-ink">
                          {formatMoney(lineTotal, form.currency)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="btn-ghost mt-3 w-full !justify-center !py-2 text-xs"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, lineItems: [...prev.lineItems, emptyItem()] }))
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                  {S.addLine}
                </button>

                <div className="mt-3 space-y-1.5 rounded-xl border border-line/10 bg-elevated px-3 py-2.5 text-sm">
                  <div className="flex justify-between gap-3 text-muted">
                    <span>{S.subtotal}</span>
                    <span className="tabular-nums text-ink">
                      {formatMoney(totals.subtotal, form.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 text-muted">
                    <span>{S.tax}</span>
                    <span className="tabular-nums text-ink">
                      {formatMoney(totals.tax, form.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3 border-t border-line/10 pt-2 font-bold text-ink">
                    <span>{S.grandTotal}</span>
                    <span className="tabular-nums text-accent">
                      {formatMoney(totals.total, form.currency)}
                    </span>
                  </div>
                </div>
              </FormSection>

              <FormSection title={S.notes}>
                <Field>
                  <textarea
                    className="field !min-h-[4.5rem]"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </Field>
              </FormSection>

              <FormActions>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? t.common.loading : t.common.save}
                </button>
                <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>
                  {t.common.cancel}
                </button>
              </FormActions>
            </form>
          </FormCard>
        ) : (
          <div className="flex min-h-[12rem] items-center justify-center rounded-2xl border border-dashed border-line/15 p-6 text-center text-sm text-muted lg:sticky lg:top-4">
            {S.selectHint}
          </div>
        )}
      </div>
    </div>
  );
};

export const Quotes = () => <SalesDocsPage kind="quotes" />;
export const Contracts = () => <SalesDocsPage kind="contracts" />;
export const Invoices = () => <SalesDocsPage kind="invoices" />;

export default SalesDocsPage;
