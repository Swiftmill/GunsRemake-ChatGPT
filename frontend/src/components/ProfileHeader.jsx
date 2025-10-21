import React from 'react';
import BadgeList from './BadgeList';

const ProfileHeader = ({ profile }) => (
  <div className="glass-card p-6 relative overflow-hidden">
    <div
      className="absolute inset-0 opacity-30"
      style={{
        backgroundImage: `url(${profile.backgroundMediaUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    />
    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white/40 shadow-glow">
          <img src={profile.avatarUrl} alt={`${profile.displayName} avatar`} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{profile.displayName}</h1>
            <span className="text-sm text-white/60">@{profile.username}</span>
          </div>
          <BadgeList badges={profile.badges} />
        </div>
      </div>
      <div className="md:ml-auto flex gap-6">
        <div>
          <p className="text-xs uppercase text-white/50">Profile Views</p>
          <p className="text-2xl font-bold">{profile.stats?.views?.toLocaleString?.() || '0'}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-white/50">Favorites</p>
          <p className="text-2xl font-bold">{profile.stats?.likes?.toLocaleString?.() || '0'}</p>
        </div>
      </div>
    </div>
    <p className="relative z-10 mt-4 max-w-2xl text-white/80 leading-relaxed">{profile.bio}</p>
  </div>
);

export default ProfileHeader;
