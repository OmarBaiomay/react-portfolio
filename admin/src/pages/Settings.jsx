import { useEffect, useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { authAPI } from '../services/api';
import { Field, FormActions, FormCard, FormSection } from '../components/FormUI';

const Settings = () => {
  const { t } = useLanguage();
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    details: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      fullName: user.fullName || '',
      email: user.email || '',
      details: user.details || '',
    }));
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error(t.settings.passwordMismatch);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        details: formData.details,
      };
      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }
      const { data } = await authAPI.updateAccount(payload);
      setUser(data);
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      toast.success(t.settings.saved);
    } catch (error) {
      toast.error(error.response?.data?.message || t.settings.saveFail);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-slide-in mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-accent">
          <SettingsIcon className="h-4 w-4" />
          {t.nav.settings}
        </p>
        <h1 className="font-display text-3xl font-bold text-ink">{t.settings.title}</h1>
        <p className="mt-1 text-muted">{t.settings.subtitle}</p>
      </div>

      <FormCard>
        <form onSubmit={onSubmit} className="space-y-5">
          <FormSection title={t.settings.title}>
            <div className="space-y-4">
              <Field label={t.settings.name} required>
                <input
                  className="input-field"
                  value={formData.fullName}
                  onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                  required
                />
              </Field>
              <Field label={t.settings.email} required>
                <input
                  type="email"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </Field>
              <Field label={t.settings.details}>
                <textarea
                  className="input-field"
                  value={formData.details}
                  onChange={(e) => setFormData((p) => ({ ...p, details: e.target.value }))}
                  placeholder={t.settings.detailsPlaceholder}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection title={t.settings.changePassword}>
            <div className="space-y-4">
              <Field label={t.settings.currentPassword}>
                <input
                  type="password"
                  className="input-field"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData((p) => ({ ...p, currentPassword: e.target.value }))}
                  autoComplete="current-password"
                />
              </Field>
              <Field label={t.settings.newPassword}>
                <input
                  type="password"
                  className="input-field"
                  value={formData.newPassword}
                  onChange={(e) => setFormData((p) => ({ ...p, newPassword: e.target.value }))}
                  minLength={6}
                  autoComplete="new-password"
                />
              </Field>
              <Field label={t.settings.confirmPassword}>
                <input
                  type="password"
                  className="input-field"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
                  minLength={6}
                  autoComplete="new-password"
                />
              </Field>
            </div>
          </FormSection>

          <FormActions>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? t.common.loading : t.common.save}
            </button>
          </FormActions>
        </form>
      </FormCard>
    </div>
  );
};

export default Settings;
