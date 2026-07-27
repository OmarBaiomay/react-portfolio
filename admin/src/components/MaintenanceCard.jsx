import { Edit2, Trash2 } from 'lucide-react';

const MaintenanceCard = ({ plan, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100">{plan.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(plan)}
            className="p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>
          <button
            onClick={() => onDelete(plan._id)}
            className="p-2 bg-red-50 dark:bg-zinc-800 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {plan.features.map((feature, index) => (
          <p key={index} className="text-sm text-gray-600 dark:text-zinc-400">• {feature}</p>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${plan.priceUSD} / month</p>
        <p className="text-xs text-gray-500 dark:text-zinc-500">{plan.priceEGP}</p>
      </div>
    </div>
  );
};

export default MaintenanceCard;