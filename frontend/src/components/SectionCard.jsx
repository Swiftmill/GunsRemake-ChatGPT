import React from 'react';

const SectionCard = ({ title, description, action, children }) => (
  <section className="glass-card p-6 space-y-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-white/60">{description}</p>}
      </div>
      {action}
    </div>
    <div>{children}</div>
  </section>
);

export default SectionCard;
