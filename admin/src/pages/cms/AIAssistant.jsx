import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AlertCircle,
  CheckCircle2,
  FolderOpen,
  Link2,
  Loader2,
  Newspaper,
  Settings2,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { aiAPI } from '../../services/api';
import { FormCard } from '../../components/FormUI';

function JobStatus({ job, onOpen }) {
  const { t } = useLanguage();
  const A = t.cms.ai;
  if (!job) return null;
  const tone =
    job.status === 'done'
      ? 'border-emerald-500/40 bg-emerald-500/10'
      : job.status === 'failed'
        ? 'border-red-500/40 bg-red-500/10'
        : 'border-accent/40 bg-accent/10';
  return (
    <div className={`flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 ${tone}`} role="status">
      {job.status === 'running' ? (
        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-accent" />
      ) : job.status === 'done' ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">
          {job.status === 'running' ? A.running : job.status === 'done' ? A.done : A.failed}
        </p>
        <p className="text-xs text-muted">{job.status === 'failed' ? job.error : job.progress}</p>
      </div>
      {job.status === 'done' ? (
        <button type="button" className="btn-primary" onClick={() => onOpen(job)}>
          {job.type === 'project' ? A.openProject : A.openPost}
        </button>
      ) : null}
    </div>
  );
}

/** Poll a job until it finishes. */
function useJob() {
  const [job, setJob] = useState(null);
  const timer = useRef(null);
  const stop = () => clearTimeout(timer.current);

  const track = useCallback((initial) => {
    stop();
    setJob(initial);
    const poll = async () => {
      try {
        const { data } = await aiAPI.getJob(initial.id);
        setJob(data);
        if (data.status === 'running') timer.current = setTimeout(poll, 2500);
      } catch {
        timer.current = setTimeout(poll, 5000);
      }
    };
    timer.current = setTimeout(poll, 1500);
  }, []);

  useEffect(() => stop, []);
  return [job, track];
}

export default function AIAssistant() {
  const { t } = useLanguage();
  const A = t.cms.ai;
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [provider, setProvider] = useState('');
  const [history, setHistory] = useState([]);

  const [url, setUrl] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [projectJob, trackProject] = useJob();

  const [topic, setTopic] = useState('');
  const [blogNotes, setBlogNotes] = useState('');
  const [length, setLength] = useState('medium');
  const [blogJob, trackBlog] = useJob();

  const loadHistory = () =>
    aiAPI
      .getJobs()
      .then(({ data }) => setHistory(data))
      .catch(() => {});

  useEffect(() => {
    aiAPI
      .getSettings()
      .then(({ data }) => {
        setSettings(data);
        setProvider(data.defaultProvider);
      })
      .catch((error) => toast.error(error.response?.data?.message || A.loadError));
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (projectJob?.status === 'done' || blogJob?.status === 'done') loadHistory();
  }, [projectJob?.status, blogJob?.status]);

  const ready = settings?.providers?.[provider]?.hasKey;
  const busy = (job) => job?.status === 'running';

  const openResult = (job) => {
    if (job.type === 'project') navigate(`/portfolio?edit=${encodeURIComponent(job.result.slug)}`);
    else navigate(`/blog?edit=${encodeURIComponent(job.result.postId)}`);
  };

  const start = async (fn, payload, track) => {
    try {
      const { data } = await fn({ ...payload, provider });
      track(data);
    } catch (error) {
      toast.error(error.response?.data?.message || A.startError);
    }
  };

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            {t.cms.website}
          </p>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{A.title}</h1>
          <p className="mt-1 text-sm text-muted">{A.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {settings ? (
            <select value={provider} onChange={(e) => setProvider(e.target.value)} className="field !w-auto" aria-label={A.provider}>
              {Object.entries(settings.providers).map(([id, p]) => (
                <option key={id} value={id}>
                  {p.label} {p.hasKey ? `· ${p.model}` : `· ${A.noKey}`}
                </option>
              ))}
            </select>
          ) : null}
          <Link to="/ai-settings" className="btn-ghost">
            <Settings2 className="h-4 w-4" />
            {A.settings}
          </Link>
        </div>
      </div>

      {settings && !ready ? (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
          <span className="flex-1 text-ink">{A.needKey}</span>
          <Link to="/ai-settings" className="btn-primary !py-2">
            {A.addKey}
          </Link>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <FormCard title={A.projectTitle} description={A.projectHint}>
          <label className="block">
            <span className="form-label">{A.url}</span>
            <span className="relative block">
              <Link2 className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                dir="ltr"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://client-website.com"
                className="field !ps-9"
              />
            </span>
          </label>
          <label className="block">
            <span className="form-label">{A.notes}</span>
            <textarea
              rows={3}
              value={projectNotes}
              onChange={(e) => setProjectNotes(e.target.value)}
              placeholder={A.projectNotesPh}
              className="field"
            />
          </label>
          <button
            type="button"
            className="btn-primary w-full"
            disabled={!ready || !url.trim() || busy(projectJob)}
            onClick={() => start(aiAPI.createProject, { url: url.trim(), notes: projectNotes }, trackProject)}
          >
            {busy(projectJob) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {A.generateProject}
          </button>
          <JobStatus job={projectJob} onOpen={openResult} />
        </FormCard>

        <FormCard title={A.blogTitle} description={A.blogHint}>
          <label className="block">
            <span className="form-label">{A.topic}</span>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={A.topicPh}
              className="field"
            />
          </label>
          <label className="block">
            <span className="form-label">{A.notes}</span>
            <textarea rows={2} value={blogNotes} onChange={(e) => setBlogNotes(e.target.value)} placeholder={A.blogNotesPh} className="field" />
          </label>
          <div>
            <span className="form-label">{A.length}</span>
            <div className="locale-tabs">
              {['short', 'medium', 'long'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLength(key)}
                  className={`locale-tab ${length === key ? 'locale-tab-active' : ''}`}
                >
                  {A.lengths[key]}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="btn-primary w-full"
            disabled={!ready || topic.trim().length < 3 || busy(blogJob)}
            onClick={() => start(aiAPI.createBlog, { topic: topic.trim(), notes: blogNotes, length }, trackBlog)}
          >
            {busy(blogJob) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {A.generateBlog}
          </button>
          <JobStatus job={blogJob} onOpen={openResult} />
        </FormCard>
      </div>

      <p className="mt-4 text-xs text-muted">{A.reviewNote}</p>

      {history.length ? (
        <section className="mt-10">
          <h2 className="form-label">{A.history}</h2>
          <ul className="space-y-2">
            {history.map((job) => (
              <li key={job.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line/10 bg-elevated px-4 py-3 text-sm">
                {job.type === 'project' ? <FolderOpen className="h-4 w-4 text-muted" /> : <Newspaper className="h-4 w-4 text-muted" />}
                <span className="min-w-0 flex-1 truncate text-ink">
                  {job.result?.title?.en || job.input?.url || job.input?.topic}
                </span>
                <span className="text-xs text-muted">
                  {job.provider} · {job.model} · {new Date(job.createdAt).toLocaleString()}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    job.status === 'done'
                      ? 'bg-emerald-500/15 text-emerald-500'
                      : job.status === 'failed'
                        ? 'bg-red-500/15 text-red-500'
                        : 'bg-accent/15 text-accent'
                  }`}
                  title={job.error || ''}
                >
                  {job.status === 'done' ? A.done : job.status === 'failed' ? A.failed : A.running}
                </span>
                {job.status === 'done' ? (
                  <button type="button" className="btn-ghost !py-1.5 text-xs" onClick={() => openResult(job)}>
                    {t.cms.edit}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
