import React from 'react';

const StatCard = ({ title, value, trend, icon }) => (
  <div className="glass-card p-5 space-y-3">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm uppercase tracking-wide text-white/50">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="text-3xl text-gunspink">{icon}</div>
    </div>
    {trend && <p className="text-xs text-emerald-300">▲ {trend}% this week</p>}
  </div>
);

export default StatCard;
