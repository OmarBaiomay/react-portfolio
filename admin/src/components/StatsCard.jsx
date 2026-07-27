const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 dark:text-zinc-400 text-sm font-medium">{title}</h3>
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-zinc-100">{value}</p>
    </div>
  );
};

export default StatsCard;