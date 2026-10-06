import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, KeyRound, Loader2, Plug, Save, Sparkles, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { aiAPI } from '../../services/api';
import { CmsLoading } from '../../components/cms/CmsFields';
import { FormCard } from '../../components/FormUI';

const MODEL_HINTS = {
  anthropic: 'claude-opus-5-5 · claude-sonnet-5-5 · claude-haiku-4-5',
  openai: 'gpt-5 · gpt-5-mini …',
  gemini: 'gemini-2.5-pro · gemini-2.5-flash …',
  compatible: 'deepseek-chat · meta-llama/… · mistral-large-latest …',
};
const BASE_URL_HINTS = 'https://api.deepseek.com · https://openrouter.ai/api/v1 · https://api.groq.com/openai/v1';

export default function AISettings() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const A = t.cms.ai;
  const canEdit = user?.role === 'admin';
  const [settings, setSettings] = useState(null);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState('');

  const load = async () => {
    try {
      const { data } = await aiAPI.getSettings();
      setSettings(data);
      setDraft({
        defaultProvider: data.defaultProvider,
        effort: data.effort,
        providers: Object.fromEntries(
          Object.entries(data.providers).map(([id, p]) => [id, { model: p.model, baseURL: p.baseURL, apiKey: '' }])
        ),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || A.loadError);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!settings) return <CmsLoading />;

  const setProvider = (id, patch) =>
    setDraft((d) => ({ ...d, providers: { ...d.providers, [id]: { ...d.providers[id], ...patch } } }));

  const save = async (extra = {}) => {
    setSaving(true);
    try {
      const { data } = await aiAPI.saveSettings({ ...draft, ...extra });
      setSettings(data);
      setDraft((d) => ({
        ...d,
        providers: Object.fromEntries(Object.entries(d.providers).map(([id, p]) => [id, { ...p, apiKey: '' }])),
      }));
      toast.success(A.savedSettings);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || t.cms.saveError);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const test = async (id) => {
    setTesting(id);
    try {
      if (draft.providers[id].apiKey || canEdit) await save();
      const { data } = await aiAPI.test(id);
      toast.success(`${A.testOk} · ${data.model} · ${(data.ms / 1000).toFixed(1)}s`);
    } catch (error) {
      toast.error(error.response?.data?.message || A.testFail);
    } finally {
      setTesting('');
    }
  };

  return (
    <div className="mx-auto max-w-4xl pb-16">
      <div className="sticky top-0 z-20 -mx-1 mb-6 border-b border-line/10 bg-bg/90 px-1 pb-4 pt-1 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              {A.title}
            </p>
            <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{A.settingsTitle}</h1>
            <p className="mt-1 text-sm text-muted">{A.settingsHint}</p>
          </div>
          {canEdit ? (
            <button type="button" className="btn-primary" onClick={() => save()} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {t.cms.save}
            </button>
          ) : null}
        </div>
      </div>

      {!canEdit ? <p className="mb-4 rounded-xl border border-line/10 p-4 text-sm text-muted">{A.adminOnly}</p> : null}

      <FormCard title={A.defaults}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="form-label">{A.defaultProvider}</span>
            <select
              className="field"
              value={draft.defaultProvider}
              disabled={!canEdit}
              onChange={(e) => setDraft((d) => ({ ...d, defaultProvider: e.target.value }))}
            >
              {Object.entries(settings.providers).map(([id, p]) => (
                <option key={id} value={id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="form-label">{A.effort}</span>
            <select
              className="field"
              value={draft.effort}
              disabled={!canEdit}
              onChange={(e) => setDraft((d) => ({ ...d, effort: e.target.value }))}
            >
              {settings.efforts.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
            <span className="form-hint block">{A.effortHint}</span>
          </label>
        </div>
      </FormCard>

      <div className="mt-6 space-y-6">
        {Object.entries(settings.providers).map(([id, p]) => (
          <FormCard
            key={id}
            title={p.label}
            actions={
              p.hasKey ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-500">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {p.keySource === 'env' ? A.keyFromEnv : A.keySaved}
                </span>
              ) : (
                <span className="rounded-full bg-line/10 px-2.5 py-1 text-xs font-semibold text-muted">{A.noKey}</span>
              )
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="form-label">{A.apiKey}</span>
                <span className="relative block">
                  <KeyRound className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="password"
                    dir="ltr"
                    autoComplete="off"
                    disabled={!canEdit}
                    value={draft.providers[id].apiKey}
                    placeholder={p.hasKey ? `${A.keyStored} ${p.keyPreview} — ${A.keyReplace}` : A.keyPaste}
                    onChange={(e) => setProvider(id, { apiKey: e.target.value })}
                    className="field !ps-9 font-mono text-xs"
                  />
                </span>
              </label>
              <label className="block">
                <span className="form-label">{A.model}</span>
                <input
                  dir="ltr"
                  disabled={!canEdit}
                  value={draft.providers[id].model}
                  placeholder={p.defaultModel}
                  onChange={(e) => setProvider(id, { model: e.target.value })}
                  className="field font-mono text-xs"
                />
                <span className="form-hint block">{MODEL_HINTS[id]}</span>
              </label>
              {id === 'compatible' ? (
                <label className="block">
                  <span className="form-label">{A.baseURL}</span>
                  <input
                    dir="ltr"
                    type="url"
                    disabled={!canEdit}
                    value={draft.providers[id].baseURL}
                    placeholder="https://…/v1"
                    onChange={(e) => setProvider(id, { baseURL: e.target.value })}
                    className="field font-mono text-xs"
                  />
                  <span className="form-hint block">{BASE_URL_HINTS}</span>
                </label>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-ghost" onClick={() => test(id)} disabled={Boolean(testing) || (!p.hasKey && !draft.providers[id].apiKey)}>
                {testing === id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plug className="h-4 w-4" />}
                {A.test}
              </button>
              {canEdit && p.keySource === 'dashboard' ? (
                <button
                  type="button"
                  className="btn-ghost hover:!border-red-500/50 hover:!text-red-500"
                  onClick={() => save({ providers: { ...draft.providers, [id]: { ...draft.providers[id], clearKey: true } } })}
                >
                  <Trash2 className="h-4 w-4" />
                  {A.removeKey}
                </button>
              ) : null}
            </div>
          </FormCard>
        ))}
      </div>
    </div>
  );
}
