import React, { useEffect, useState } from 'react';
import { FiBarChart2, FiEdit3, FiImage, FiMusic } from 'react-icons/fi';
import api from '../api/client';
import useAuth from '../hooks/useAuth';
import SectionCard from '../components/SectionCard';
import LinkList from '../components/LinkList';

const DashboardPage = () => {
  const { user, loadProfile } = useAuth();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return;
      try {
        const { data } = await api.get(`/admin/analytics/${user.id}`);
        setAnalytics(data);
      } catch (error) {
        console.warn(error);
      }
    };
    loadAnalytics();
  }, [user]);

  if (!user) {
    return (
      <div className="glass-card p-10 text-center text-white/60">
        <p>Sign in to manage your profile and view analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Welcome back, {user.displayName || user.username}</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <SectionCard
          title="Profile Completion"
          description="Upload avatar, background media and fill out your bio."
          action={<span className="rounded-full bg-white/10 px-3 py-1 text-xs">100% complete</span>}
        >
          <div className="flex items-center gap-4 text-sm text-white/70">
            <FiEdit3 className="text-xl text-gunspink" />
            Customize your layout with templates, reorder sections and add galleries.
          </div>
        </SectionCard>
        <SectionCard title="Assets" description="Manage backgrounds, audio and avatars." action={<FiImage className="text-2xl text-gunspink" />}>
          <p className="text-sm text-white/60">Upload up to 20MB per file. Drag and drop support is available in the customize panel.</p>
        </SectionCard>
        <SectionCard title="Audio" description="Control background tracks." action={<FiMusic className="text-2xl text-gunspink" />}>
          <p className="text-sm text-white/60">Use autoplay responsibly and provide mute toggles for mobile visitors.</p>
        </SectionCard>
      </div>

      <SectionCard title="Your Links" description="Reorder with drag and drop inside the customize tab.">
        <LinkList links={user.links || []} />
      </SectionCard>

      <SectionCard
        title="Analytics"
        description="Track profile views and link engagement over time."
        action={<FiBarChart2 className="text-2xl text-gunspink" />}
      >
        {analytics ? (
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div className="glass-card p-4">
              <p className="text-white/60">Last 30 days views</p>
              <p className="text-2xl font-semibold">{analytics.totals.views}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-white/60">Last 30 days clicks</p>
              <p className="text-2xl font-semibold">{analytics.totals.clicks}</p>
            </div>
          </div>
        ) : (
          <p className="text-white/60">Analytics will appear after your profile receives traffic.</p>
        )}
      </SectionCard>
    </div>
  );
};

export default DashboardPage;
