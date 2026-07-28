const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="glass rounded-xl p-6 transition hover:border-accent/40 hover:shadow-glow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted">{title}</h3>
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="font-display text-3xl font-bold text-ink">{value}</p>
    </div>
  );
};

export default StatsCard;
