import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { projectsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { formatDate, formatMoney, PROJECT_STATUSES, StatusBadge } from '../lib/crm.jsx';
import { Field, FormActions, FormCard, FormGrid, FormSection } from '../components/FormUI';

const empty = {
  title: '',
  description: '',
  status: 'planned',
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  startDate: '',
  dueDate: '',
  budget: '',
};

const Projects = () => {
  const { t } = useLanguage();
  const P = t.projects;
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const params = filter ? { status: filter } : {};
      const { data } = await projectsAPI.getAll(params);
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.response?.data?.message || P.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const onCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await projectsAPI.create({
        ...form,
        budget: form.budget === '' ? null : Number(form.budget),
        startDate: form.startDate || null,
        dueDate: form.dueDate || null,
      });
      toast.success(P.created);
      setShowForm(false);
      setForm(empty);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || P.saveError);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm(P.confirmDelete)) return;
    try {
      await projectsAPI.delete(id);
      toast.success(P.deleted);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || P.saveError);
    }
  };

  if (loading && !items.length) {
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
          <h1 className="font-display text-3xl font-bold text-ink">{P.title}</h1>
          <p className="mt-1 text-muted">{P.subtitle}</p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="h-4 w-4" />
          {P.add}
        </button>
      </div>

      <div className="mb-4">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="field max-w-xs">
          <option value="">{P.allStatuses}</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {P.statuses[s] || s}
            </option>
          ))}
        </select>
      </div>

      {showForm ? (
        <FormCard title={P.add} className="mb-6">
          <form onSubmit={onCreate} className="space-y-5">
            <FormSection>
              <FormGrid cols={2}>
                <Field label={P.fields.title} required className="sm:col-span-2">
                  <input
                    className="field"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </Field>
                <Field label={P.fields.clientName}>
                  <input
                    className="field"
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  />
                </Field>
                <Field label={P.fields.clientEmail}>
                  <input
                    className="field"
                    type="email"
                    value={form.clientEmail}
                    onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                  />
                </Field>
                <Field label={P.fields.clientPhone}>
                  <input
                    className="field"
                    value={form.clientPhone}
                    onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
                  />
                </Field>
                <Field label={P.fields.status}>
                  <select
                    className="field"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {P.statuses[s] || s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={P.fields.startDate}>
                  <input
                    type="date"
                    className="field"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </Field>
                <Field label={P.fields.dueDate}>
                  <input
                    type="date"
                    className="field"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </Field>
                <Field label={P.fields.budget}>
                  <input
                    className="field"
                    type="number"
                    step="0.01"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  />
                </Field>
                <Field label={P.fields.description} className="sm:col-span-2">
                  <textarea
                    className="field"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </Field>
              </FormGrid>
            </FormSection>
            <FormActions>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? t.common.loading : t.common.save}
              </button>
              <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>
                {t.common.cancel}
              </button>
            </FormActions>
          </form>
        </FormCard>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-2xl border border-line/10 bg-elevated p-5">
            <div className="mb-3 flex items-start justify-between gap-2">
              <Link to={`/projects/${p.id}`} className="font-display text-lg font-semibold text-ink hover:text-accent">
                {p.title}
              </Link>
              <StatusBadge status={p.status} labels={P.statuses} />
            </div>
            <p className="text-sm text-muted">{p.clientName || '—'}</p>
            <p className="mt-2 text-xs text-muted">
              {formatDate(p.startDate)} → {formatDate(p.dueDate)}
            </p>
            {p.budget != null ? (
              <p className="mt-1 text-sm text-ink">{formatMoney(p.budget)}</p>
            ) : null}
            <div className="mt-4 flex gap-2">
              <Link to={`/projects/${p.id}`} className="btn-ghost !py-2 text-xs">
                {P.open}
              </Link>
              <button type="button" onClick={() => onDelete(p.id)} className="icon-btn">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {!items.length ? <p className="text-muted md:col-span-3">{P.empty}</p> : null}
      </div>
    </div>
  );
};

export default Projects;
