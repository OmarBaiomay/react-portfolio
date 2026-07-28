import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Flag, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { projectsAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  formatDate,
  MILESTONE_STATUSES,
  PROJECT_STATUSES,
  StatusBadge,
  TASK_STATUSES,
} from '../lib/crm.jsx';

const ProjectDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const P = t.projects;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskMilestoneId, setTaskMilestoneId] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await projectsAPI.getOne(id);
      setProject(data);
    } catch (error) {
      toast.error(error.response?.data?.message || P.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const updateProject = async (patch) => {
    try {
      const { data } = await projectsAPI.update(id, patch);
      setProject((prev) => ({ ...prev, ...data }));
      toast.success(P.updated);
    } catch (error) {
      toast.error(error.response?.data?.message || P.saveError);
    }
  };

  const addMilestone = async (e) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) return;
    try {
      await projectsAPI.createMilestone(id, { title: milestoneTitle.trim() });
      setMilestoneTitle('');
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || P.saveError);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    try {
      await projectsAPI.createTask(id, {
        title: taskTitle.trim(),
        milestoneId: taskMilestoneId || null,
      });
      setTaskTitle('');
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || P.saveError);
    }
  };

  if (loading || !project) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const milestones = project.milestones || [];
  const tasks = project.tasks || [];

  return (
    <div className="animate-slide-in">
      <Link to="/projects" className="mb-4 inline-flex items-center gap-2 text-sm text-muted hover:text-accent">
        <ArrowLeft className="h-4 w-4" />
        {P.back}
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">{project.title}</h1>
          <p className="mt-1 text-muted">{project.clientName}</p>
        </div>
        <select
          className="field max-w-xs"
          value={project.status}
          onChange={(e) => updateProject({ status: e.target.value })}
        >
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {P.statuses[s] || s}
            </option>
          ))}
        </select>
      </div>

      {project.description ? (
        <p className="mb-8 max-w-3xl text-sm text-muted">{project.description}</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line/10 bg-elevated p-5">
          <div className="mb-4 flex items-center gap-2">
            <Flag className="h-4 w-4 text-accent" />
            <h2 className="font-display text-lg font-bold text-ink">{P.milestones}</h2>
          </div>
          <form onSubmit={addMilestone} className="mb-4 flex gap-2">
            <input
              className="field"
              placeholder={P.milestonePlaceholder}
              value={milestoneTitle}
              onChange={(e) => setMilestoneTitle(e.target.value)}
            />
            <button type="submit" className="btn-primary shrink-0">
              <Plus className="h-4 w-4" />
            </button>
          </form>
          <ul className="space-y-3">
            {milestones.map((m) => (
              <li key={m.id} className="rounded-lg border border-line/10 bg-surface p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink">{m.title}</p>
                    <p className="text-xs text-muted">{formatDate(m.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="field !py-1 text-xs"
                      value={m.status}
                      onChange={async (e) => {
                        await projectsAPI.updateMilestone(id, m.id, { status: e.target.value });
                        await load();
                      }}
                    >
                      {MILESTONE_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {P.milestoneStatuses[s] || s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={async () => {
                        await projectsAPI.deleteMilestone(id, m.id);
                        await load();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {!milestones.length ? <p className="text-sm text-muted">{P.noMilestones}</p> : null}
          </ul>
        </section>

        <section className="rounded-2xl border border-line/10 bg-elevated p-5">
          <div className="mb-4 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-accent" />
            <h2 className="font-display text-lg font-bold text-ink">{P.tasks}</h2>
          </div>
          <form onSubmit={addTask} className="mb-4 space-y-2">
            <input
              className="field"
              placeholder={P.taskPlaceholder}
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <select
                className="field"
                value={taskMilestoneId}
                onChange={(e) => setTaskMilestoneId(e.target.value)}
              >
                <option value="">{P.noMilestone}</option>
                {milestones.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-primary shrink-0">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </form>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="rounded-lg border border-line/10 bg-surface p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink">{task.title}</p>
                    <StatusBadge status={task.status} labels={P.taskStatuses} />
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="field !py-1 text-xs"
                      value={task.status}
                      onChange={async (e) => {
                        await projectsAPI.updateTask(id, task.id, { status: e.target.value });
                        await load();
                      }}
                    >
                      {TASK_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {P.taskStatuses[s] || s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={async () => {
                        await projectsAPI.deleteTask(id, task.id);
                        await load();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {!tasks.length ? <p className="text-sm text-muted">{P.noTasks}</p> : null}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetail;
