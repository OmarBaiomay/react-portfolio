import {
  FaBehance,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaSnapchat,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { Mail, MapPin, Phone, Search, Share2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useContentPart } from '../../lib/cms';
import { BiField, BiStringList, CmsHeader, CmsLoading } from '../../components/cms/CmsFields';
import { FormCard } from '../../components/FormUI';

const SOCIALS = [
  { key: 'linkedin', label: 'LinkedIn', Icon: FaLinkedinIn, placeholder: 'https://www.linkedin.com/company/…' },
  { key: 'instagram', label: 'Instagram', Icon: FaInstagram, placeholder: 'https://instagram.com/…' },
  { key: 'x', label: 'X (Twitter)', Icon: FaXTwitter, placeholder: 'https://x.com/…' },
  { key: 'facebook', label: 'Facebook', Icon: FaFacebookF, placeholder: 'https://facebook.com/…' },
  { key: 'tiktok', label: 'TikTok', Icon: FaTiktok, placeholder: 'https://tiktok.com/@…' },
  { key: 'snapchat', label: 'Snapchat', Icon: FaSnapchat, placeholder: 'https://snapchat.com/add/…' },
  { key: 'youtube', label: 'YouTube', Icon: FaYoutube, placeholder: 'https://youtube.com/@…' },
  { key: 'behance', label: 'Behance', Icon: FaBehance, placeholder: 'https://behance.net/…' },
];

function IconInput({ Icon, label, hint, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block min-w-0">
      <span className="form-label">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type={type}
          dir="ltr"
          value={value || ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="field !ps-9"
        />
      </span>
      {hint ? <span className="form-hint block">{hint}</span> : null}
    </label>
  );
}

export default function SiteInfo() {
  const { t } = useLanguage();
  const c = t.cms;
  const S = c.site;
  const part = useContentPart('site', { saved: c.savedToast, reset: c.resetToast, loadError: c.loadError, saveError: c.saveError });
  const site = part.value;

  if (!site) return <CmsLoading />;

  const set = (key, val) => part.update((prev) => ({ ...prev, [key]: val }));
  const setSocial = (key, val) => part.update((prev) => ({ ...prev, socials: { ...prev.socials, [key]: val } }));
  const setSeo = (key, val) => part.update((prev) => ({ ...prev, seo: { ...prev.seo, [key]: val } }));

  return (
    <div className="mx-auto max-w-4xl pb-16">
      <CmsHeader
        title={S.title}
        description={S.description}
        icon={Share2}
        dirty={part.dirty}
        saving={part.saving}
        edited={part.edited}
        onSave={part.save}
        onReset={part.reset}
      />

      <div className="space-y-6">
        <FormCard title={S.contact}>
          <div className="grid gap-4 sm:grid-cols-2">
            <IconInput Icon={Mail} type="email" label={S.email} value={site.email} onChange={(v) => set('email', v)} />
            <IconInput
              Icon={Phone}
              type="tel"
              label={S.phone}
              hint={S.numberHint}
              value={site.phone}
              onChange={(v) => set('phone', v)}
              placeholder="+966 5X XXX XXXX"
            />
            <IconInput
              Icon={FaWhatsapp}
              type="tel"
              label={S.whatsapp}
              hint={S.numberHint}
              value={site.whatsapp}
              onChange={(v) => set('whatsapp', v)}
              placeholder="+966 5X XXX XXXX"
            />
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-8 h-4 w-4 shrink-0 text-muted" />
            <div className="flex-1">
              <BiField label={S.address} value={site.address} onChange={(v) => set('address', v)} />
            </div>
          </div>
        </FormCard>

        <FormCard title={S.socials} description={S.socialHint}>
          <div className="grid gap-4 sm:grid-cols-2">
            {SOCIALS.map(({ key, label, Icon, placeholder }) => (
              <IconInput
                key={key}
                Icon={Icon}
                type="url"
                label={label}
                value={site.socials?.[key]}
                placeholder={placeholder}
                onChange={(v) => setSocial(key, v.trim())}
              />
            ))}
          </div>
        </FormCard>

        <FormCard title={S.seo}>
          <div className="flex items-center gap-2 text-xs text-muted">
            <Search className="h-3.5 w-3.5" />
            Google · Bing · AI search
          </div>
          <BiField
            label={S.seoDescription}
            multiline
            value={site.seo?.description}
            onChange={(v) => setSeo('description', v)}
          />
          <BiStringList label={S.keywords} value={site.seo?.keywords} onChange={(v) => setSeo('keywords', v)} />
        </FormCard>
      </div>
    </div>
  );
}
