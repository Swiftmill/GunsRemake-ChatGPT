import React from 'react';
import { Link } from 'react-router-dom';
import { FiCompass, FiLayout, FiMusic, FiShield } from 'react-icons/fi';
import { sampleProfiles } from '../data/sampleProfiles';
import ProfileHeader from '../components/ProfileHeader';
import LinkList from '../components/LinkList';
import MusicPlayer from '../components/MusicPlayer';
import GalleryGrid from '../components/GalleryGrid';

const features = [
  {
    icon: <FiLayout />,
    title: 'Pixel-perfect templates',
    description: 'Reorder sections, tweak colors, gradients and UI effects with live preview.'
  },
  {
    icon: <FiMusic />,
    title: 'Immersive experiences',
    description: 'Background video, autoplay music and ambient blur for dramatic presentations.'
  },
  {
    icon: <FiCompass />,
    title: 'Sharable public pages',
    description: 'Claim your handle and share your guns-inspired profile with a short link.'
  },
  {
    icon: <FiShield />,
    title: 'Admin-grade controls',
    description: 'Manage badges, templates and analytics with a full control center.'
  }
];

const LandingPage = () => {
  const highlightProfile = sampleProfiles[0];
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#14042c] p-10 text-center shadow-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(92,50,168,0.35),_transparent)]" />
        <div className="relative z-10 mx-auto max-w-3xl space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/60">
            <span className="size-2 rounded-full bg-emerald-400" />
            Everything you loved about guns.lol, modernized.
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Feature-rich link-in-bio hosting with neon aesthetics and instant personalization.
          </h1>
          <p className="text-lg text-white/70">
            Build immersive profiles with background media, music, badges, analytics and an integrated asset manager.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login" className="rounded-full bg-gunspink px-6 py-3 text-sm font-semibold shadow-glow">
              Create your profile
            </Link>
            <Link to="/swift" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 hover:bg-white/10">
              Explore swift&apos;s page
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.title} className="glass-card p-6 text-left">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/10 p-3 text-2xl text-gunspink">{feature.icon}</div>
              <div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-8">
        <h2 className="text-2xl font-bold">Live preview</h2>
        <p className="max-w-3xl text-sm text-white/60">
          Every account comes with the same creator tools that power guns.lol. Customize your background media, audio, color palette,
          link order, badges and image gallery directly in the browser.
        </p>
        <ProfileHeader profile={highlightProfile} />
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <LinkList links={highlightProfile.links} />
            <MusicPlayer trackUrl={highlightProfile.musicUrl} autoPlay />
          </div>
          <GalleryGrid images={highlightProfile.gallery} />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
