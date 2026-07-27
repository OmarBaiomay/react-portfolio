import { Edit2, Trash2, Star } from 'lucide-react';

const PackageCard = ({ package: pkg, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">{pkg.title}</h3>
            {pkg.featured && (
              <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            )}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase">{pkg.name}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(pkg)}
            className="p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>
          <button
            onClick={() => onDelete(pkg._id)}
            className="p-2 bg-red-50 dark:bg-zinc-800 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">{pkg.subtitle}</p>

      <div className="space-y-2 mb-4">
        {pkg.features.slice(0, 3).map((feature, index) => (
          <p key={index} className="text-xs text-gray-500 dark:text-zinc-500">• {feature}</p>
        ))}
        {pkg.features.length > 3 && (
          <p className="text-xs text-gray-400 dark:text-zinc-600">+ {pkg.features.length - 3} more</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-zinc-800">
        <div>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${pkg.priceUSD}</p>
          <p className="text-xs text-gray-500 dark:text-zinc-500">{pkg.priceEGP}</p>
        </div>
        <p className="text-sm text-gray-600 dark:text-zinc-400">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Delivery:</span> {pkg.delivery}
        </p>
      </div>
    </div>
  );
};

export default PackageCard;