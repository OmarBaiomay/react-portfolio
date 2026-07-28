import { Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { pickLocalized, pickLocalizedList } from '../lib/i18nContent';

const MaintenanceCard = ({ plan, onEdit, onDelete }) => {
  const { lang } = useLanguage();
  const name = pickLocalized(plan.name, lang);
  const features = pickLocalizedList(plan.features, lang);

  return (
    <div className="rounded-xl border border-line/10 bg-elevated p-6 transition-all hover:border-accent hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-lg font-bold text-ink">{name}</h3>
        <div className="flex gap-2">
          <button type="button" onClick={() => onEdit(plan)} className="rounded-lg bg-surface p-2">
            <Edit2 className="h-4 w-4 text-accent" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(plan._id || plan.id)}
            className="rounded-lg bg-red-500/10 p-2"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        {features.map((feature, index) => (
          <p key={index} className="text-sm text-muted">
            • {feature}
          </p>
        ))}
      </div>

      <div className="border-t border-line/10 pt-4">
        <p className="text-lg font-bold text-accent">${plan.priceUSD} / month</p>
        <p className="text-xs text-muted">{plan.priceEGP}</p>
      </div>
    </div>
  );
};

export default MaintenanceCard;
