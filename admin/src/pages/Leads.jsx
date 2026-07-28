import { useEffect, useState } from 'react';
import { Filter, FolderPlus, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { leadsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { formatDate, LEAD_STATUSES, StatusBadge } from '../lib/crm.jsx';
import { Field, FormActions, FormCard, FormSection } from '../components/FormUI';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  whatsapp: '',
  whatsappSameAsPhone: true,
  service: 'web',
  message: '',
  status: 'new',
  notes: '',
};

const Leads = () => {
  const { t } = useLanguage();
  const L = t.leads;
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const { data } = await leadsAPI.getAll(params);
      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.response?.data?.message || L.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const openNew = () => {
    setSelected('new');
    setForm(emptyForm);
  };

  const openEdit = (lead) => {
    setSelected(lead.id);
    setForm({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      whatsapp: lead.whatsapp || '',
      whatsappSameAsPhone: Boolean(lead.whatsappSameAsPhone),
      service: lead.service || 'web',
      message: lead.message || '',
      status: lead.status || 'new',
      notes: lead.notes || '',
    });
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        whatsapp: form.whatsappSameAsPhone ? form.phone : form.whatsapp,
      };
      if (selected === 'new') {
        await leadsAPI.create(payload);
        toast.success(L.created);
      } else {
        await leadsAPI.update(selected, payload);
        toast.success(L.updated);
      }
      setSelected(null);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || L.saveError);
    } finally {
      setSaving(false);
    }
  };

  const onArchive = async (id) => {
    if (!window.confirm(L.confirmArchive)) return;
    try {
      await leadsAPI.delete(id);
      toast.success(L.archived);
      if (selected === id) setSelected(null);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || L.saveError);
    }
  };

  const onConvert = async (id) => {
    if (!window.confirm(L.confirmConvert)) return;
    try {
      await leadsAPI.convert(id);
      toast.success(L.converted);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || L.saveError);
    }
  };

  if (loading && !leads.length) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-slide-in">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">{L.title}</h1>
          <p className="mt-1 text-muted">{L.subtitle}</p>
        </div>
        <button type="button" onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" />
          {L.add}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-muted" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="field max-w-xs"
        >
          <option value="">{L.allStatuses}</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {L.statuses[s] || s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-line/10 bg-elevated">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-line/10 bg-surface text-start text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">{L.cols.name}</th>
                  <th className="px-4 py-3 font-semibold">{L.cols.contact}</th>
                  <th className="px-4 py-3 font-semibold">{L.cols.status}</th>
                  <th className="px-4 py-3 font-semibold">{L.cols.date}</th>
                  <th className="px-4 py-3 font-semibold">{L.cols.actions}</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`border-b border-line/5 hover:bg-surface/60 ${
                      selected === lead.id ? 'bg-accent/5' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openEdit(lead)}
                        className="text-start font-medium text-ink hover:text-accent"
                      >
                        {lead.name}
                      </button>
                      <p className="text-xs text-muted">{lead.service}</p>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      <div>{lead.email}</div>
                      <div className="text-xs">{lead.phone}</div>
                      <div className="text-xs">WA: {lead.whatsapp}</div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} labels={L.statuses} />
                    </td>
                    <td className="px-4 py-3 text-muted">{formatDate(lead.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {!lead.convertedProjectId ? (
                          <button
                            type="button"
                            onClick={() => onConvert(lead.id)}
                            className="icon-btn"
                            title={L.convert}
                          >
                            <FolderPlus className="h-4 w-4" />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => onArchive(lead.id)}
                          className="icon-btn"
                          title={L.archive}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!leads.length ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-muted">
                      {L.empty}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        {selected ? (
          <FormCard title={selected === 'new' ? L.add : L.edit}>
            <form onSubmit={onSave} className="space-y-4">
              <FormSection>
                <div className="space-y-4">
                  {[
                    ['name', L.fields.name],
                    ['email', L.fields.email],
                    ['phone', L.fields.phone],
                  ].map(([key, label]) => (
                    <Field key={key} label={label} required>
                      <input
                        className="field"
                        required
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      />
                    </Field>
                  ))}
                  <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-line/10 bg-elevated px-3.5 py-3 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={form.whatsappSameAsPhone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          whatsappSameAsPhone: e.target.checked,
                          whatsapp: e.target.checked ? form.phone : form.whatsapp,
                        })
                      }
                      className="h-4 w-4 rounded accent-[rgb(var(--c-accent))]"
                    />
                    {L.fields.whatsappSame}
                  </label>
                  {!form.whatsappSameAsPhone ? (
                    <Field label={L.fields.whatsapp} required>
                      <input
                        className="field"
                        required
                        value={form.whatsapp}
                        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      />
                    </Field>
                  ) : null}
                  <Field label={L.fields.status}>
                    <select
                      className="field"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {L.statuses[s] || s}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label={L.fields.service}>
                    <input
                      className="field"
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                    />
                  </Field>
                  <Field label={L.fields.message}>
                    <textarea
                      className="field"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </Field>
                  <Field label={L.fields.notes}>
                    <textarea
                      className="field"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </Field>
                </div>
              </FormSection>
              <FormActions>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? t.common.loading : t.common.save}
                </button>
                <button type="button" onClick={() => setSelected(null)} className="btn-ghost">
                  {t.common.cancel}
                </button>
              </FormActions>
            </form>
          </FormCard>
        ) : (
          <div className="rounded-2xl border border-dashed border-line/15 p-8 text-center text-sm text-muted">
            {L.selectHint}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;
