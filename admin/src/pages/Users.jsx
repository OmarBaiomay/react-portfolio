import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Users as UsersIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Field, FormActions, FormModal, FormSection } from '../components/FormUI';

const emptyForm = {
  fullName: '',
  email: '',
  password: '',
  role: 'editor',
  details: '',
};

const Users = () => {
  const { t } = useLanguage();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await userAPI.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.response?.data?.message || t.users.loadError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      password: '',
      role: user.role || 'editor',
      details: user.details || '',
    });
    setShowForm(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const payload = {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          details: formData.details,
        };
        if (formData.password) payload.password = formData.password;
        await userAPI.update(editing.id || editing._id, payload);
        toast.success(t.users.updateOk);
      } else {
        await userAPI.create(formData);
        toast.success(t.users.createOk);
      }
      setShowForm(false);
      setEditing(null);
      setFormData(emptyForm);
      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || (editing ? t.users.updateFail : t.users.createFail)
      );
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (user) => {
    if (!window.confirm(t.users.deleteConfirm)) return;
    try {
      await userAPI.delete(user.id || user._id);
      toast.success(t.users.deleteOk);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || t.users.deleteFail);
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="rounded-2xl border border-line/10 bg-elevated p-8 text-center text-muted">
        {t.users.adminOnly}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-slide-in">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">{t.users.title}</h1>
          <p className="mt-1 text-muted">{t.users.subtitle}</p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" />
          {t.users.add}
        </button>
      </div>

      {users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line/20 p-12 text-center">
          <UsersIcon className="mx-auto mb-3 h-10 w-10 text-muted" />
          <p className="text-muted">{t.users.empty}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line/10 bg-elevated">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-line/10 bg-surface/60 text-start text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t.users.name}</th>
                  <th className="px-4 py-3 font-semibold">{t.users.email}</th>
                  <th className="px-4 py-3 font-semibold">{t.users.role}</th>
                  <th className="px-4 py-3 font-semibold">{t.users.details}</th>
                  <th className="px-4 py-3 font-semibold">{t.common.edit}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id || user._id} className="border-b border-line/5 last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">{user.fullName}</td>
                    <td className="px-4 py-3 text-muted">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-accent/15 px-2 py-1 text-xs font-semibold text-accent">
                        {user.role === 'admin' ? t.users.roleAdmin : t.users.roleEditor}
                      </span>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-muted">{user.details || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEdit(user)} className="icon-btn">
                          <Pencil className="h-4 w-4 text-accent" />
                        </button>
                        <button type="button" onClick={() => onDelete(user)} className="icon-btn">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm ? (
        <FormModal
          title={editing ? t.users.edit : t.users.add}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
        >
          <form onSubmit={onSubmit} className="space-y-5 p-5 sm:p-6">
            <FormSection>
              <div className="space-y-4">
                <Field label={t.users.name} required>
                  <input
                    className="input-field"
                    value={formData.fullName}
                    onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                    required
                  />
                </Field>
                <Field label={t.users.email} required>
                  <input
                    type="email"
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </Field>
                <Field label={editing ? t.users.newPasswordOptional : t.users.password} required={!editing}>
                  <input
                    type="password"
                    className="input-field"
                    value={formData.password}
                    onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                    required={!editing}
                    minLength={editing && !formData.password ? undefined : 6}
                  />
                </Field>
                <Field label={t.users.role}>
                  <select
                    className="input-field"
                    value={formData.role}
                    onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                  >
                    <option value="admin">{t.users.roleAdmin}</option>
                    <option value="editor">{t.users.roleEditor}</option>
                  </select>
                </Field>
                <Field label={t.users.details}>
                  <textarea
                    className="input-field"
                    value={formData.details}
                    onChange={(e) => setFormData((p) => ({ ...p, details: e.target.value }))}
                    placeholder={t.users.detailsPlaceholder}
                  />
                </Field>
              </div>
            </FormSection>
            <FormActions>
              <button type="submit" disabled={saving} className="btn-primary flex-1 sm:flex-none">
                {saving ? t.common.loading : t.common.save}
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
              >
                {t.common.cancel}
              </button>
            </FormActions>
          </form>
        </FormModal>
      ) : null}
    </div>
  );
};

export default Users;
