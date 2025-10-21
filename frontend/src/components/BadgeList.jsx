import React from 'react';
import clsx from 'clsx';

const BadgeList = ({ badges = [] }) => {
  if (!badges.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          key={badge.name}
          className={clsx('badge-pill backdrop-blur-sm border border-white/20', badge.color && 'border-transparent')}
          style={badge.color ? { backgroundColor: `${badge.color}20`, color: badge.color } : undefined}
        >
          <span>{badge.icon || '🎖️'}</span>
          {badge.name}
        </span>
      ))}
    </div>
  );
};

export default BadgeList;
