import { Edit2, Trash2, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { pickLocalized, pickLocalizedList } from '../lib/i18nContent';

const PackageCard = ({ package: pkg, onEdit, onDelete }) => {
  const { lang, t } = useLanguage();
  const name = pickLocalized(pkg.name, lang);
  const title = pickLocalized(pkg.title, lang);
  const subtitle = pickLocalized(pkg.subtitle, lang);
  const delivery = pickLocalized(pkg.delivery, lang);
  const features = pickLocalizedList(pkg.features, lang);

  return (
    <div className="rounded-xl border border-line/10 bg-elevated p-6 transition-all hover:border-accent hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-bold text-ink">{title}</h3>
            {pkg.featured ? <Star className="h-4 w-4 fill-accent text-accent" /> : null}
          </div>
          <p className="text-xs font-semibold uppercase text-accent">{name}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onEdit(pkg)} className="rounded-lg bg-surface p-2">
            <Edit2 className="h-4 w-4 text-accent" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(pkg._id || pkg.id)}
            className="rounded-lg bg-red-500/10 p-2"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>

      <p className="mb-4 text-sm text-muted">{subtitle}</p>

      <div className="mb-4 space-y-2">
        {features.slice(0, 3).map((feature, index) => (
          <p key={index} className="text-xs text-muted">
            • {feature}
          </p>
        ))}
        {features.length > 3 ? (
          <p className="text-xs text-muted">+ {features.length - 3} more</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-t border-line/10 pt-4">
        <div>
          <p className="text-lg font-bold text-accent">${pkg.priceUSD}</p>
          <p className="text-xs text-muted">{pkg.priceEGP}</p>
        </div>
        <p className="text-sm text-muted">
          <span className="font-semibold text-accent">{t.form.delivery}:</span> {delivery}
        </p>
      </div>
    </div>
  );
};

export default PackageCard;
