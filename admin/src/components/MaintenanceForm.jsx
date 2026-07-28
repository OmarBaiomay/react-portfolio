import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  emptyI18nList,
  emptyI18nText,
  normalizeI18nList,
  normalizeI18nText,
} from '../lib/i18nContent';
import {
  Field,
  FormActions,
  FormGrid,
  FormModal,
  FormSection,
  LocaleTabs,
} from './FormUI';

const MaintenanceForm = ({ plan: editPlan, onSubmit, onClose }) => {
  const { t } = useLanguage();
  const [localeTab, setLocaleTab] = useState('en');
  const [formData, setFormData] = useState({
    name: emptyI18nText(),
    features: emptyI18nList(),
    priceUSD: '',
    priceEGP: '',
    order: 0,
  });

  useEffect(() => {
    if (!editPlan) return;
    setFormData({
      name: normalizeI18nText(editPlan.name),
      features: normalizeI18nList(editPlan.features),
      priceUSD: editPlan.priceUSD || '',
      priceEGP: editPlan.priceEGP || '',
      order: editPlan.order || 0,
    });
  }, [editPlan]);

  const handleFeatureChange = (index, value) => {
    setFormData((prev) => {
      const list = [...prev.features[localeTab]];
      list[index] = value;
      return { ...prev, features: { ...prev.features, [localeTab]: list } };
    });
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [localeTab]: [...prev.features[localeTab], ''],
      },
    }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [localeTab]: prev.features[localeTab].filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      features: {
        en: formData.features.en.filter(Boolean),
        ar: formData.features.ar.filter(Boolean),
      },
    });
  };

  const features = formData.features[localeTab] || [''];
  const dir = localeTab === 'ar' ? 'rtl' : 'ltr';

  return (
    <FormModal
      title={editPlan ? t.form.editPlan : t.form.createPlan}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
        <FormSection>
          <LocaleTabs
            value={localeTab}
            onChange={setLocaleTab}
            labels={{ en: t.form.english, ar: t.form.arabic }}
          />
          <p className="form-hint mt-2">{t.form.i18nHint}</p>

          <div className="mt-4 space-y-4">
            <Field label={t.form.planName} required={localeTab === 'en'}>
              <input
                type="text"
                value={formData.name[localeTab]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: { ...prev.name, [localeTab]: e.target.value },
                  }))
                }
                className="input-field"
                dir={dir}
                required={localeTab === 'en'}
              />
            </Field>

            <Field label={t.form.features}>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={`${localeTab}-${index}`} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="input-field flex-1"
                      dir={dir}
                      placeholder={t.form.featurePlaceholder}
                      required={localeTab === 'en' && index === 0}
                    />
                    {features.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="icon-btn !text-rose-400"
                        aria-label={t.common.delete}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="btn-ghost w-full !justify-center text-sm"
                >
                  <Plus className="h-4 w-4" />
                  {t.form.addFeature}
                </button>
              </div>
            </Field>
          </div>
        </FormSection>

        <FormSection>
          <FormGrid cols={2}>
            <Field label={t.form.priceUSD} required>
              <input
                type="text"
                value={formData.priceUSD}
                onChange={(e) => setFormData((p) => ({ ...p, priceUSD: e.target.value }))}
                className="input-field"
                required
              />
            </Field>
            <Field label={t.form.priceEGP} required>
              <input
                type="text"
                value={formData.priceEGP}
                onChange={(e) => setFormData((p) => ({ ...p, priceEGP: e.target.value }))}
                className="input-field"
                required
              />
            </Field>
            <Field label={t.form.order} className="sm:col-span-2">
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData((p) => ({ ...p, order: Number(e.target.value) || 0 }))}
                className="input-field"
              />
            </Field>
          </FormGrid>
        </FormSection>

        <FormActions>
          <button type="submit" className="btn-primary flex-1 sm:flex-none">
            {editPlan ? t.common.save : t.form.createPlan}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">
            {t.common.cancel}
          </button>
        </FormActions>
      </form>
    </FormModal>
  );
};

export default MaintenanceForm;
