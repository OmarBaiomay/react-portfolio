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

const PackageForm = ({ package: editPackage, onSubmit, onClose }) => {
  const { t } = useLanguage();
  const [localeTab, setLocaleTab] = useState('en');
  const [formData, setFormData] = useState({
    name: emptyI18nText(),
    title: emptyI18nText(),
    subtitle: emptyI18nText(),
    icon: 'rocket',
    features: emptyI18nList(),
    delivery: emptyI18nText(),
    priceUSD: '',
    priceEGP: '',
    featured: false,
    order: 0,
  });

  useEffect(() => {
    if (!editPackage) return;
    setFormData({
      name: normalizeI18nText(editPackage.name),
      title: normalizeI18nText(editPackage.title),
      subtitle: normalizeI18nText(editPackage.subtitle),
      icon: editPackage.icon || 'rocket',
      features: normalizeI18nList(editPackage.features),
      delivery: normalizeI18nText(editPackage.delivery),
      priceUSD: editPackage.priceUSD || '',
      priceEGP: editPackage.priceEGP || '',
      featured: Boolean(editPackage.featured),
      order: editPackage.order || 0,
    });
  }, [editPackage]);

  const setI18nField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [localeTab]: value },
    }));
  };

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
      title={editPackage ? t.form.editPackage : t.form.createPackage}
      onClose={onClose}
      wide
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
        <FormSection title={t.form.english + ' / ' + t.form.arabic}>
          <LocaleTabs
            value={localeTab}
            onChange={setLocaleTab}
            labels={{ en: t.form.english, ar: t.form.arabic }}
          />
          <p className="form-hint mt-2">{t.form.i18nHint}</p>

          <div className="mt-4 space-y-4">
            <Field label={t.form.packageName} required={localeTab === 'en'}>
              <input
                type="text"
                value={formData.name[localeTab]}
                onChange={(e) => setI18nField('name', e.target.value)}
                className="input-field"
                dir={dir}
                required={localeTab === 'en'}
              />
            </Field>
            <Field label={t.form.title} required={localeTab === 'en'}>
              <input
                type="text"
                value={formData.title[localeTab]}
                onChange={(e) => setI18nField('title', e.target.value)}
                className="input-field"
                dir={dir}
                required={localeTab === 'en'}
              />
            </Field>
            <Field label={t.form.subtitle} required={localeTab === 'en'}>
              <input
                type="text"
                value={formData.subtitle[localeTab]}
                onChange={(e) => setI18nField('subtitle', e.target.value)}
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
            <Field label={t.form.delivery} required={localeTab === 'en'}>
              <input
                type="text"
                value={formData.delivery[localeTab]}
                onChange={(e) => setI18nField('delivery', e.target.value)}
                className="input-field"
                dir={dir}
                placeholder={t.form.deliveryPlaceholder}
                required={localeTab === 'en'}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title={t.form.priceUSD}>
          <FormGrid cols={2}>
            <Field label={t.form.icon}>
              <select
                value={formData.icon}
                onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))}
                className="input-field"
              >
                <option value="rocket">Rocket</option>
                <option value="crown">Crown</option>
                <option value="shield">Shield</option>
                <option value="store">Store</option>
              </select>
            </Field>
            <Field label={t.form.order}>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData((p) => ({ ...p, order: Number(e.target.value) || 0 }))}
                className="input-field"
              />
            </Field>
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
          </FormGrid>
          <label className="mt-4 flex cursor-pointer items-center gap-2.5 rounded-xl border border-line/10 bg-elevated px-3.5 py-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
              className="h-4 w-4 rounded border-line/20 accent-[rgb(var(--c-accent))]"
            />
            {t.form.featured}
          </label>
        </FormSection>

        <FormActions>
          <button type="submit" className="btn-primary flex-1 sm:flex-none">
            {editPackage ? t.common.save : t.form.createPackage}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">
            {t.common.cancel}
          </button>
        </FormActions>
      </form>
    </FormModal>
  );
};

export default PackageForm;
