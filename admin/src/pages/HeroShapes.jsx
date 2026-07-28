import { useEffect, useState } from 'react';
import { Box, Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import ScenePreview from '../components/ScenePreview';

const HeroShapes = () => {
  const { t, lang } = useLanguage();
  const [scenes, setScenes] = useState([]);
  const [sceneId, setSceneId] = useState('helix');
  const [selectedSceneId, setSelectedSceneId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const activeSceneId = selectedSceneId || sceneId;

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await settingsAPI.getHeroScene();
      if (Array.isArray(data?.scenes)) setScenes(data.scenes);
      if (data?.sceneId) setSceneId(data.sceneId);
    } catch (error) {
      toast.error(error.response?.data?.message || t.heroShapes.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onApply = async () => {
    if (!activeSceneId) return;
    setSaving(true);
    try {
      const { data } = await settingsAPI.updateHeroScene(activeSceneId);
      setSceneId(data.sceneId);
      setSelectedSceneId(null);
      if (Array.isArray(data.scenes)) setScenes(data.scenes);
      toast.success(t.heroShapes.applied);
    } catch (error) {
      toast.error(error.response?.data?.message || t.heroShapes.applyFail);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 border-b border-line/10 bg-bg pb-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-accent">
              <Box className="h-4 w-4" />
              {t.nav.heroShapes}
            </p>
            <h1 className="font-display text-3xl font-bold text-ink">{t.heroShapes.title}</h1>
            <p className="mt-1 max-w-2xl text-muted">{t.heroShapes.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onApply}
            disabled={saving || activeSceneId === sceneId}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {saving ? t.common.loading : t.heroShapes.apply}
          </button>
        </div>
        <p className="mt-3 text-sm text-muted">{t.heroShapes.hint}</p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {scenes.map((item) => {
            const isActive = item.id === sceneId;
            const isSelected = item.id === activeSceneId;
            const name = item.name?.[lang] || item.name?.en || item.id;
            const tagline = item.tagline?.[lang] || item.tagline?.en || '';

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedSceneId(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedSceneId(item.id);
                  }
                }}
                className={`cursor-pointer overflow-hidden rounded-2xl border text-start transition ${
                  isSelected
                    ? 'border-accent shadow-glow'
                    : 'border-line/10 hover:border-accent/40'
                } bg-elevated`}
              >
                <div className="relative border-b border-line/10 bg-[#0a0a0a]">
                  <ScenePreview sceneId={item.id} />
                  {isActive ? (
                    <span className="pointer-events-none absolute end-3 top-3 z-10 inline-flex items-center gap-1 rounded-md bg-accent/90 px-2 py-1 text-[11px] font-semibold text-white">
                      <Check className="h-3.5 w-3.5" />
                      {t.heroShapes.active}
                    </span>
                  ) : null}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-semibold text-ink">{name}</h3>
                  <p className="mt-1 text-xs text-muted">{tagline}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroShapes;
