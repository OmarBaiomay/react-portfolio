import {
  Boxes,
  Cloud,
  Code2,
  Container,
  Cpu,
  Database,
  FileCode2,
  GitBranch,
  Layers,
  Plus,
  Server,
  Trash2,
  Triangle,
  Wind,
  Workflow,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { assetUrl, moveItem, slugify, useContentPart } from '../../lib/cms';
import { BiField, CmsHeader, CmsLoading, RowTools } from '../../components/cms/CmsFields';

/** Must match the LUCIDE map in client/src/components/TechStack.jsx. */
const ICONS = { Boxes, Cloud, Code2, Container, Database, FileCode2, GitBranch, Layers, Server, Triangle, Wind, Workflow };

function ItemIcon({ item }) {
  if (item.icon) return <img src={assetUrl(item.icon)} alt="" className="h-6 w-6 object-contain" />;
  const Icon = ICONS[item.lucide] || Code2;
  return (
    <span className="grid h-6 w-6 place-items-center rounded" style={{ color: item.color || undefined }}>
      <Icon className="h-4 w-4" />
    </span>
  );
}

export default function TechStackAdmin() {
  const { t, lang } = useLanguage();
  const c = t.cms;
  const T = c.tech;
  const part = useContentPart('techStack', { saved: c.savedToast, reset: c.resetToast, loadError: c.loadError, saveError: c.saveError });
  const groups = part.value;

  if (!groups) return <CmsLoading />;

  const setGroup = (gi, patch) => part.update((prev) => prev.map((g, j) => (j === gi ? { ...g, ...patch } : g)));
  const setItem = (gi, ii, patch) =>
    setGroup(gi, { items: groups[gi].items.map((it, j) => (j === ii ? { ...it, ...patch } : it)) });
  const addGroup = () =>
    part.update((prev) => [...prev, { key: `group-${prev.length + 1}`, title: { en: '', ar: '' }, items: [] }]);

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <CmsHeader
        title={T.title}
        description={T.description}
        icon={Cpu}
        dirty={part.dirty}
        saving={part.saving}
        edited={part.edited}
        onSave={part.save}
        onReset={part.reset}
      >
        <button type="button" className="btn-ghost" onClick={addGroup}>
          <Plus className="h-4 w-4" />
          {T.addGroup}
        </button>
      </CmsHeader>

      <div className="space-y-6">
        {groups.map((group, gi) => (
          <div key={gi} className="form-card">
            <div className="form-card-header items-center">
              <p className="min-w-0 flex-1 truncate font-display text-lg font-bold text-ink">
                {group.title?.[lang] || group.title?.en || group.key}
              </p>
              <RowTools
                onUp={gi > 0 ? () => part.update((prev) => moveItem(prev, gi, -1)) : null}
                onDown={gi < groups.length - 1 ? () => part.update((prev) => moveItem(prev, gi, 1)) : null}
                onDelete={() => part.update((prev) => prev.filter((_, j) => j !== gi))}
              />
            </div>
            <div className="form-card-body">
              <BiField
                label={T.groupTitle}
                hint={`${T.groupKey}: ${group.key}`}
                value={group.title}
                onChange={(v) => setGroup(gi, { title: v, key: group.key || slugify(v.en) })}
              />

              <ul className="space-y-2">
                {group.items.map((item, ii) => (
                  <li key={ii} className="rounded-xl border border-line/10 bg-bg/40 p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <ItemIcon item={item} />
                      <input
                        value={item.name}
                        onChange={(e) => setItem(gi, ii, { name: e.target.value })}
                        placeholder={T.name}
                        className="field min-w-[8rem] flex-1"
                      />
                      <RowTools
                        onUp={ii > 0 ? () => setGroup(gi, { items: moveItem(group.items, ii, -1) }) : null}
                        onDown={
                          ii < group.items.length - 1 ? () => setGroup(gi, { items: moveItem(group.items, ii, 1) }) : null
                        }
                        onDelete={() => setGroup(gi, { items: group.items.filter((_, j) => j !== ii) })}
                      />
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                      <input
                        dir="ltr"
                        value={item.icon || ''}
                        placeholder={`${T.image} (/images/react.svg)`}
                        onChange={(e) => setItem(gi, ii, { icon: e.target.value })}
                        className="field font-mono text-xs"
                      />
                      <select
                        value={item.lucide || ''}
                        onChange={(e) => setItem(gi, ii, { lucide: e.target.value, icon: '' })}
                        className="field"
                        aria-label={T.icon}
                      >
                        <option value="">{T.icon}</option>
                        {Object.keys(ICONS).map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="color"
                        value={item.color || '#3b82f6'}
                        onChange={(e) => setItem(gi, ii, { color: e.target.value })}
                        className="h-10 w-full cursor-pointer rounded-xl border border-line/15 bg-bg p-1 sm:w-14"
                        aria-label={T.color}
                        title={T.color}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="btn-ghost !py-2 text-xs"
                onClick={() => setGroup(gi, { items: [...group.items, { name: '', lucide: 'Code2', color: '#3b82f6' }] })}
              >
                <Plus className="h-3.5 w-3.5" />
                {T.addItem}
              </button>
            </div>
          </div>
        ))}
        {!groups.length ? (
          <p className="flex items-center justify-center gap-2 py-10 text-muted">
            <Trash2 className="h-4 w-4" />
            {c.empty}
          </p>
        ) : null}
      </div>
    </div>
  );
}
